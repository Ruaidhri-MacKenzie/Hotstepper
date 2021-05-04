import Patch from "./patch.js";

export default class Synth {
	constructor(context) {
		this.context = context;
		this.patch = new Patch();
		this.analyser = this.context.createAnalyser();
	}

	savePatch() {
		if (!this.patch.name) return;

		// Save with localstorage API
		let patches = JSON.parse(localStorage.getItem("PATCHES"));
		if (patches) {
			const checkExists = patches[this.patch.name];
			if (checkExists) {
				const checkOverwrite = confirm(`A patch already exists with the name ${this.patch.name}. Would you like to overwrite it?`);
				if (!checkOverwrite) {
					const name = prompt("Enter a patch name:");
					if (!name) return;
					else this.patch.name = name;
				}
			}
		} else {
			patches = {};
		}

		patches[this.patch.name] = this.patch;
		localStorage.setItem("PATCHES", JSON.stringify(patches));
	}

	loadPatch(patchName) {
		// Check for built-in patch names
		if (patchName === "" || patchName === "Kick Drum" || patchName === "Snare Drum" || patchName === "Hi-Hat") {
			return;
		}

		// Load patches with localstorage API
		const patches = JSON.parse(localStorage.getItem("PATCHES"));
		if (!patches) {
			localStorage.setItem("PATCHES", JSON.stringify({}));
			return;
		}

		// Check for patch in list of saved patches
		const patch = patches[patchName];
		if (!patch) {
			return;
		}

		// Set the patch info for this synth to the saved patch info
		this.patch = patch;
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
		levelNode.connect(this.analyser);

		// Playback
		oscillator.start(time);
		lfo.start(time);
		oscillator.stop(time + duration + releaseTime);
	}
}
