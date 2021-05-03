import Patch from "./patch.js";

export default class Synth {
	constructor(context) {
		this.context = context;
		this.patch = new Patch();
	}

	savePatch() {
		// Save with localstorage API
		if (!this.patch.name) {
			const name = prompt("Enter a patch name:");
			this.patch.name = name;
		}

		const checkExists = localStorage.getItem(this.patch.name);
		if (checkExists) {
			const confirm = comfirm(`A patch already exists with the name ${this.patch.name}. Would you like to overwrite it?`);
			if (!confirm) return;
		}

		localStorage.setItem(this.patch.name, JSON.stringify(this.patch));
	}

	loadPatch(patchName) {
		// Load with localstorage API
		const patch = localStorage.getItem(patchName);
		if (patch) {
			this.patch = JSON.parse(patch);
		} else {
			console.log(`No patch found with name ${patchName}.`);
		}
	}

	play(time, duration, pitch, pan, level) {
		// Create Oscillator
		const oscillator = this.context.createOscillator();
		oscillator.type = this.patch.oscillatorType;
		oscillator.frequency.setValueAtTime(pitch, time);

		// Create Frequency Filter
		const filter = this.context.createBiquadFilter();
		filter.type = this.patch.filterType;
		filter.frequency.setValueAtTime(this.patch.filterCutoff, time);
		filter.Q.setValueAtTime(this.patch.filterResonance, time);

		// Create Low Frequency Oscillator (LFO)
		const lfo = this.context.createOscillator();
		lfo.frequency.setValueAtTime(this.patch.lfoRate, time);

		const lfoDepth = this.context.createGain();
		lfoDepth.gain.setValueAtTime(1 + this.patch.lfoDepth / 10, time);

		// Create Amplitude Envelope
		const attackTime = duration * this.patch.envelopeAttack;
		const decayTime = duration * this.patch.envelopeDecay;
		const sustainLevel = this.patch.envelopeSustain;
		const releaseTime = duration * this.patch.envelopeRelease;

		const envelope = this.context.createGain();
		envelope.gain.setValueAtTime(0, time);
		envelope.gain.linearRampToValueAtTime(1, time + attackTime);
		envelope.gain.linearRampToValueAtTime(sustainLevel, time + attackTime + decayTime);
		envelope.gain.linearRampToValueAtTime(0, time + duration + releaseTime);

		// Pan left or right
		const panNode = this.context.createStereoPanner();
		panNode.pan.setValueAtTime(pan, time);

		// Set master level
		const levelNode = this.context.createGain();
		levelNode.gain.setValueAtTime(level / 100, time);

		// Connect nodes in context graph
		oscillator.connect(filter).connect(envelope).connect(panNode).connect(levelNode).connect(this.context.destination);
		lfo.connect(lfoDepth).connect(oscillator.frequency);

		// Playback
		oscillator.start(time);
		lfo.start(time);
		oscillator.stop(time + duration + releaseTime);
	}
}
