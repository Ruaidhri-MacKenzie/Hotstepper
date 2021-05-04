import { PITCH } from "../constants.js";
import Synth from "./synth.js";

export default class KeyboardSynth extends Synth {
	constructor(context) {
		super(context);
		this.volume = 75;

		// DOM REFERENCES
		this.$element = document.querySelector(".synth");

		// Oscillator
		this.$oscillatorTypes = document.querySelectorAll("input[name='oscillatorType']");
		this.$oscilloscope = document.querySelector(".oscillator__oscilloscope");

		// Frequency Filter
		this.$filterTypes = document.querySelectorAll("input[name='filterType']");
		this.$filterCutoff = document.querySelector(".filter__cutoff-input");
		this.$filterCutoffPot = document.querySelector(".filter__cutoff-display");
		this.$filterResonance = document.querySelector(".filter__resonance-input");
		this.$filterResonancePot = document.querySelector(".filter__resonance-display");

		// Low-Frequency Oscillator (LFO)
		this.$lfoRate = document.querySelector(".lfo__rate-input");
		this.$lfoRatePot = document.querySelector(".lfo__rate-display");
		this.$lfoDepth = document.querySelector(".lfo__depth-input");
		this.$lfoDepthPot = document.querySelector(".lfo__depth-display");

		// Amplitude Envelope
		this.$envelopeAttack = document.querySelector(".envelope__attack-input");
		this.$envelopeDecay = document.querySelector(".envelope__decay-input");
		this.$envelopeSustain = document.querySelector(".envelope__sustain-input");
		this.$envelopeRelease = document.querySelector(".envelope__release-input");

		// Master Synth Volume
		this.$volume = document.querySelector(".master__volume-input");

		// Synth Patches
		this.$patchSave = document.querySelector(".master__patch-save");
		this.$patchList = document.querySelector(".master__patch-list");

		// Musical DOM Keyboard Keys
		this.$keyboardKeys = document.querySelectorAll(".keyboard__key");

		// EVENT HANDLERS
		// Oscillator
		this.$oscillatorTypes.forEach(($option) => $option.addEventListener("input", this.onChangeSelect.bind(this)));

		// Frequency Filter
		this.$filterTypes.forEach(($option) => $option.addEventListener("input", this.onChangeSelect.bind(this)));
		this.$filterCutoff.addEventListener("input", this.onChangeInput.bind(this));
		this.$filterCutoffPot.addEventListener("click", this.onClickPot.bind(this));
		this.$filterResonance.addEventListener("input", this.onChangeInput.bind(this));
		this.$filterResonancePot.addEventListener("click", this.onClickPot.bind(this));

		// Low-Frequency Oscillator (LFO)
		this.$lfoRate.addEventListener("input", this.onChangeInput.bind(this));
		this.$lfoRatePot.addEventListener("click", this.onClickPot.bind(this));
		this.$lfoDepth.addEventListener("input", this.onChangeInput.bind(this));
		this.$lfoDepthPot.addEventListener("click", this.onClickPot.bind(this));

		// Amplitude Envelope
		this.$envelopeAttack.addEventListener("input", this.onChangeRange.bind(this));
		this.$envelopeDecay.addEventListener("input", this.onChangeRange.bind(this));
		this.$envelopeSustain.addEventListener("input", this.onChangeRange.bind(this));
		this.$envelopeRelease.addEventListener("input", this.onChangeRange.bind(this));

		// Master Synth Volume
		this.$volume.addEventListener("input", this.onChangeVolume.bind(this));

		// Save Patch button
		this.$patchSave.addEventListener("click", this.savePatch.bind(this));

		// Musical QWERTY Keyboard
		document.addEventListener("keydown", this.onKeyDown.bind(this));

		// Musical DOM Keyboard Keys
		this.$keyboardKeys.forEach(($key) => {
			$key.addEventListener("mousedown", this.onClickKey.bind(this));
		});

		// INITIAL SETUP
		// Set initial values of input elements from patch values
		this.setInputValuesFromPatch();

		// Get list of patches from localStorage and display in patch list
		this.refreshPatchList();

		// Start drawing oscilloscope
		this.canvasContext = this.$oscilloscope.getContext("2d");
		this.canvasContext.lineWidth = 2;
		requestAnimationFrame(this.drawOscilloscope.bind(this));
	}

	onChangeVolume(event) {
		this.volume = Number(this.$volume.value);
	}

	onChangeRange(event) {
		this.patch[event.target.name] = Number(event.target.value);
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

	onClickKey(event) {
		this.play(PITCH[event.target.dataset.pitch]);
	}

	setPotPosition($display) {
		const $input = $display.parentNode.children[2];
		$display.style.setProperty("--rotate", `${($input.value / $input.max) * 100 * 2 - 100}deg`);
	}

	onKeyDown(event) {
		if (!this.$element.classList.contains("synth--active")) return;
		if (event.ctrlKey) return;
		if (event.repeat) return;

		let pitch = PITCH.C4;
		const key = event.key.toLowerCase();

		// Check if shift is held, if so increase pitches by an octave
		if (event.shiftKey) {
			if (key === "a") pitch = PITCH.C4;
			else if (key === "w") pitch = PITCH.Db4;
			else if (key === "s") pitch = PITCH.D4;
			else if (key === "e") pitch = PITCH.Eb4;
			else if (key === "d") pitch = PITCH.E4;
			else if (key === "f") pitch = PITCH.F4;
			else if (key === "t") pitch = PITCH.Gb4;
			else if (key === "g") pitch = PITCH.G4;
			else if (key === "y") pitch = PITCH.Ab4;
			else if (key === "h") pitch = PITCH.A4;
			else if (key === "u") pitch = PITCH.Bb4;
			else if (key === "j") pitch = PITCH.B4;
			else if (key === "k") pitch = PITCH.C5;
			else return;
		} else {
			if (key === "a") pitch = PITCH.C3;
			else if (key === "w") pitch = PITCH.Db3;
			else if (key === "s") pitch = PITCH.D3;
			else if (key === "e") pitch = PITCH.Eb3;
			else if (key === "d") pitch = PITCH.E3;
			else if (key === "f") pitch = PITCH.F3;
			else if (key === "t") pitch = PITCH.Gb3;
			else if (key === "g") pitch = PITCH.G3;
			else if (key === "y") pitch = PITCH.Ab3;
			else if (key === "h") pitch = PITCH.A3;
			else if (key === "u") pitch = PITCH.Bb3;
			else if (key === "j") pitch = PITCH.B3;
			else if (key === "k") pitch = PITCH.C4;
			else return;
		}

		// Light up DOM keyboard
		this.$keyboardKeys.forEach(($key) => {
			if (PITCH[$key.dataset.pitch] === pitch) {
				$key.classList.add("keyboard__key--active");
				setTimeout(() => {
					$key.classList.remove("keyboard__key--active");
				}, 500);
			}
		});

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
	}

	savePatch(e) {
		if (!this.patch.name) {
			const name = prompt("Enter a patch name:");
			if (!name) return;

			this.patch.name = name;
		}

		super.savePatch();
		this.refreshPatchList();
		super.loadPatch(this.patch.name);
	}

	loadPatch(e) {
		const $patchEntries = document.querySelectorAll(".patch-entry");
		$patchEntries.forEach(($entry) => $entry.classList.remove("patch-entry--active"));
		e.target.parentNode.classList.add("patch-entry--active");

		const patchName = e.target.textContent;
		super.loadPatch(patchName);
		this.setInputValuesFromPatch();
	}

	renamePatch(e) {
		const $patchName = e.target.parentNode.parentNode.children[0];
		const currentName = $patchName.textContent;
		const newName = prompt(`Enter a new name for this patch. Current name: ${currentName}`);
		if (!newName) return;

		const patches = JSON.parse(localStorage.getItem("PATCHES"));
		patches[newName] = patches[currentName];
		patches[newName].name = newName;
		delete patches[currentName];

		localStorage.setItem("PATCHES", JSON.stringify(patches));
		$patchName.textContent = newName;
	}

	deletePatch(e) {
		const patchName = e.target.parentNode.parentNode.children[0].textContent;
		const check = confirm(`Are you sure you want to delete this patch? Patch name: ${patchName}`);
		if (!check) return;

		const patches = JSON.parse(localStorage.getItem("PATCHES"));
		delete patches[patchName];

		localStorage.setItem("PATCHES", JSON.stringify(patches));
		this.refreshPatchList();
	}

	play(pitch) {
		super.play(this.context.currentTime, 0.5, pitch, 0, this.volume);
	}

	refreshPatchList() {
		// Empty patch list
		while (this.$patchList.firstChild) {
			this.$patchList.removeChild(this.$patchList.lastChild);
		}

		const patches = JSON.parse(localStorage.getItem("PATCHES"));
		if (!patches) {
			return;
		}

		Object.keys(patches).forEach((patchName) => {
			const $patch = document.createElement("div");
			$patch.classList.add("patch-entry");
			if (patchName === this.patch.name) {
				$patch.classList.add("patch-entry--active");
			}

			const $label = document.createElement("p");
			$label.classList.add("patch-entry__label");
			$label.textContent = patchName;
			$label.addEventListener("click", this.loadPatch.bind(this));
			$patch.appendChild($label);

			const $buttons = document.createElement("div");
			$buttons.classList.add("patch-entry__buttons");
			$patch.appendChild($buttons);

			const $rename = document.createElement("button");
			$rename.classList.add("patch-entry__rename");
			$rename.textContent = "R";
			$rename.addEventListener("click", this.renamePatch.bind(this));
			$buttons.appendChild($rename);

			const $delete = document.createElement("button");
			$delete.classList.add("patch-entry__delete");
			$delete.textContent = "X";
			$delete.addEventListener("click", this.deletePatch.bind(this));
			$buttons.appendChild($delete);

			this.$patchList.appendChild($patch);
		});
	}

	drawOscilloscope() {
		const width = this.canvasContext.canvas.width;
		const height = this.canvasContext.canvas.height;
		const scaleY = height / 256; // matches intervals in data between 0 and 255
		let startX = 0;

		const timeData = new Uint8Array(this.analyser.frequencyBinCount);
		this.analyser.getByteTimeDomainData(timeData); // data returned between 0 and 255, 128 is midpoint (no sound)

		this.canvasContext.fillStyle = "rgba(0, 0, 0, 0.1)";
		this.canvasContext.fillRect(0, 0, width, height);

		this.canvasContext.strokeStyle = "rgb(0, 200, 0)";
		this.canvasContext.beginPath();

		// find the first point which has timeData less than or equal to 128
		while (timeData[startX] > 128 && startX <= width) {
			startX += 1;
		}
		if (startX >= width) startX = 0;

		// find the first point which has timeData more than 128
		while (timeData[startX] <= 128 && startX <= width) {
			startX += 1;
		}
		if (startX >= width) startX = 0;
		// these loops will find the first point at which the wave is rising in the timeData

		for (let x = 0; x < width; x++) {
			if (startX + x >= timeData.length) break;
			const y = timeData[startX + x] * scaleY;
			this.canvasContext.lineTo(x, height - y);
		}

		this.canvasContext.stroke();
		requestAnimationFrame(this.drawOscilloscope.bind(this));
	}
}
