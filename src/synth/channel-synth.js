import Synth from "./synth.js";

export default class ChannelSynth extends Synth {
	constructor(context) {
		super(context);
		this.loadSamples();
	}

	async loadSamples() {
		this.kick = await this.getFile("wav/kick.wav");
		this.snare = await this.getFile("wav/snare.wav");
		this.hiHat = await this.getFile("wav/hi-hat.wav");
	}

	async getFile(filepath) {
		const response = await fetch(filepath);
		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
		return audioBuffer;
	}

	playSample(time, sample, pan, level) {
		const sampleSource = this.context.createBufferSource();
		sampleSource.buffer = sample;

		const panNode = this.context.createStereoPanner();
		panNode.pan.setValueAtTime(pan, time);

		const levelNode = this.context.createGain();
		levelNode.gain.setValueAtTime(level / 100, time);

		sampleSource.connect(panNode).connect(levelNode).connect(this.context.destination);
		sampleSource.start(time);
	}

	playKick(time, pan, level) {
		this.playSample(time, this.kick, pan, level);
	}

	playSnare(time, pan, level) {
		this.playSample(time, this.snare, pan, level);
	}

	playHiHat(time, pan, level) {
		this.playSample(time, this.hiHat, pan, level);
	}

	reloadPatch() {
		super.loadPatch(this.patch.name);
	}
}
