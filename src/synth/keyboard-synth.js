import { PITCH } from "../constants.js";
import Synth from "./synth.js";

export default class KeyboardSynth extends Synth {
	constructor(context) {
		super(context);
		this.volume = 75;

		// DOM REFERENCES
		this.$oscillatorTypes = document.querySelectorAll("input[name='oscillatorType']");

		this.$filterTypes = document.querySelectorAll("input[name='filterType']");
		this.$filterCutoff = document.querySelector(".filter__cutoff-input");
		this.$filterCutoffPot = document.querySelector(".filter__cutoff-display");
		this.$filterResonance = document.querySelector(".filter__resonance-input");
		this.$filterResonancePot = document.querySelector(".filter__resonance-display");

		this.$lfoRate = document.querySelector(".lfo__rate-input");
		this.$lfoRatePot = document.querySelector(".lfo__rate-display");
		this.$lfoDepth = document.querySelector(".lfo__depth-input");
		this.$lfoDepthPot = document.querySelector(".lfo__depth-display");

		this.$envelopeAttack = document.querySelector(".envelope__attack-input");
		this.$envelopeDecay = document.querySelector(".envelope__decay-input");
		this.$envelopeSustain = document.querySelector(".envelope__sustain-input");
		this.$envelopeRelease = document.querySelector(".envelope__release-input");

		this.$volume = document.querySelector(".master__volume");
		this.$patchLoad = document.querySelector(".master__load");
		this.$patchSave = document.querySelector(".master__save");
		this.$patchName = document.querySelector(".master__patch-name");

		// EVENT HANDLERS
		this.$oscillatorTypes.forEach(($option) => $option.addEventListener("input", this.onChangeSelect.bind(this)));

		this.$filterTypes.forEach(($option) => $option.addEventListener("input", this.onChangeSelect.bind(this)));
		this.$filterCutoff.addEventListener("input", this.onChangeInput.bind(this));
		this.$filterCutoffPot.addEventListener("click", this.onClickPot.bind(this));
		this.$filterResonance.addEventListener("input", this.onChangeInput.bind(this));
		this.$filterResonancePot.addEventListener("click", this.onClickPot.bind(this));

		this.$lfoRate.addEventListener("input", this.onChangeInput.bind(this));
		this.$lfoRatePot.addEventListener("click", this.onClickPot.bind(this));
		this.$lfoDepth.addEventListener("input", this.onChangeInput.bind(this));
		this.$lfoDepthPot.addEventListener("click", this.onClickPot.bind(this));

		this.$envelopeAttack.addEventListener("input", this.onChangeInput.bind(this));
		this.$envelopeDecay.addEventListener("input", this.onChangeInput.bind(this));
		this.$envelopeSustain.addEventListener("input", this.onChangeInput.bind(this));
		this.$envelopeRelease.addEventListener("input", this.onChangeInput.bind(this));

		this.$volume.addEventListener("input", this.onChangeVolume.bind(this));
		this.$patchLoad.addEventListener("click", this.loadPatch.bind(this));
		this.$patchSave.addEventListener("click", this.savePatch.bind(this));

		// Musical QWERTY Keyboard
		document.addEventListener("keydown", this.onKeyDown.bind(this));

		// Set initial values of input elements from patch values
		this.setInputValuesFromPatch();
	}

	onChangeVolume() {
		this.volume = Number(this.$volume.value);
	}

	onChangeInput(event) {
		const $input = event.target;
		const value = parseInt($input.value, 10);

		if (!isNaN(value)) {
			if (value < $input.min) this.patch[$input.name] = $input.min;
			else if (value > $input.max) this.patch[$input.name] = $input.max;
			else this.patch[$input.name] = value;
		}

		$input.value = this.patch[$input.name];
	}

	onChangeSelect(event) {
		this.patch[event.target.name] = event.target.value;
	}

	onClickPot(event) {
		const $display = event.target;
		const $input = $display.parentNode.children[2];

		const { left, top, width, height } = $display.getBoundingClientRect();
		const x = event.clientX - left;
		const y = event.clientY - top;

		const percentX = parseInt((x / width) * 100, 10);
		const percentY = parseInt((y / height) * 100, 10);

		let percentOfMaxValue = percentX;
		if (percentY >= 65) {
			if (percentX < 50) {
				percentOfMaxValue = 0;
			} else {
				percentOfMaxValue = 100;
			}
		}

		const value = $input.max * (percentOfMaxValue / 100);
		$input.value = value;
		this.patch[$input.name] = value;
		this.setPotPosition($display);
	}

	setPotPosition($display) {
		const $input = $display.parentNode.children[2];
		$display.style.setProperty("--rotate", `${($input.value / $input.max) * 100 * 2 - 100}deg`);
	}

	onKeyDown(event) {
		if (event.repeat) return;
		let pitch = PITCH.C4;
		const key = event.key.toLowerCase();

		if (key === "w") pitch = PITCH.C3;
		else if (key === "e") pitch = PITCH.D3;
		else if (key === "r") pitch = PITCH.E3;
		else if (key === "t") pitch = PITCH.F3;
		else if (key === "y") pitch = PITCH.G3;
		else if (key === "u") pitch = PITCH.A3;
		else if (key === "i") pitch = PITCH.B3;
		else if (key === "s") pitch = PITCH.C4;
		else if (key === "d") pitch = PITCH.D4;
		else if (key === "f") pitch = PITCH.E4;
		else if (key === "g") pitch = PITCH.F4;
		else if (key === "h") pitch = PITCH.G4;
		else if (key === "j") pitch = PITCH.A4;
		else if (key === "k") pitch = PITCH.B4;
		else if (key === "z") pitch = PITCH.C5;
		else if (key === "x") pitch = PITCH.D5;
		else if (key === "c") pitch = PITCH.E5;
		else if (key === "v") pitch = PITCH.F5;
		else if (key === "b") pitch = PITCH.G5;
		else if (key === "n") pitch = PITCH.A5;
		else if (key === "m") pitch = PITCH.B5;
		else if (key === ",") pitch = PITCH.C6;
		else return;

		this.play(pitch);
	}

	setInputValuesFromPatch() {
		this.$oscillatorTypes.forEach(($option) => {
			if ($option.value === this.patch.oscillatorType) $option.checked = true;
		});

		this.$filterTypes.forEach(($option) => {
			if ($option.value === this.patch.filterType) $option.checked = true;
		});
		this.$filterCutoff.value = this.patch.filterCutoff;
		this.setPotPosition(this.$filterCutoffPot);
		this.$filterResonance.value = this.patch.filterResonance;
		this.setPotPosition(this.$filterResonancePot);

		this.$lfoRate.value = this.patch.lfoRate;
		this.setPotPosition(this.$lfoRatePot);
		this.$lfoDepth.value = this.patch.lfoDepth;
		this.setPotPosition(this.$lfoDepthPot);

		this.$envelopeAttack.value = this.patch.envelopeAttack;
		this.$envelopeDecay.value = this.patch.envelopeDecay;
		this.$envelopeSustain.value = this.patch.envelopeSustain;
		this.$envelopeRelease.value = this.patch.envelopeRelease;

		this.$volume.value = this.volume;
		this.$patchName.textContent = this.patch.name || "<Untitled>";
	}

	loadPatch() {
		const patchName = prompt("Enter patch name:");
		super.loadPatch(patchName);
		this.setInputValuesFromPatch();
	}

	play(pitch) {
		super.play(this.context.currentTime, 0.5, pitch, 0, this.volume);
	}
}
