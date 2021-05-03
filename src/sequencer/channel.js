import { PITCH } from "../constants.js";
import ChannelSynth from "../synth/channel-synth.js";
import Sequence from "./sequence.js";

export default class Channel {
	constructor(context, index, setSolo) {
		this.context = context;
		this.index = index;

		this.level = 75;
		this.pan = 0;
		this.patch = "Kick Drum";
		this.isMute = false;
		this.pitch = PITCH.C4;

		this.sequence = new Sequence(this.context, this.index);
		this.synth = new ChannelSynth(this.context);

		this.$element = document.getElementById(`channel${this.index}`);
		this.$level = this.$element.querySelector(".channel__level");
		this.$pan = this.$element.querySelector(".channel__pan");
		this.$patch = this.$element.querySelector(".channel__patch");
		this.$mute = this.$element.querySelector(".channel__mute");
		this.$solo = this.$element.querySelector(".channel__solo");

		this.$level.addEventListener("input", this.setLevel.bind(this));
		this.$pan.addEventListener("input", this.setPan.bind(this));
		this.$patch.addEventListener("input", this.setPatch.bind(this));
		this.$mute.addEventListener("click", this.toggleMute.bind(this));
		this.$solo.addEventListener("click", () => setSolo(this.index));

		const patches = JSON.parse(localStorage.getItem("PATCHES"));
		if (patches) {
			Object.keys(patches).forEach((patchName) => {
				const $option = document.createElement("option");
				$option.value = patchName;
				$option.textContent = patchName;
				this.$patch.appendChild($option);
			});
		}
	}

	setLevel() {
		this.level = Number(this.$level.value);
	}

	setPan() {
		this.pan = Number(this.$pan.value);
	}

	setPatch() {
		this.patch = this.$patch.value;
		if (this.patch !== "" && this.patch !== "Kick Drum" && this.patch !== "Snare Drum" && this.patch !== "Hi-Hat") {
			this.synth.loadPatch(this.patch);
		}
	}

	toggleMute() {
		this.isMute = !this.isMute;
		this.$mute.classList.toggle("channel__mute--active");
	}

	play(step, time, duration) {
		if (this.isMute) return;

		if (this.sequence.steps[step]) {
			if (this.patch === "" || this.patch === "Kick Drum") {
				this.synth.playKick(time, this.pan, this.level);
			} else if (this.patch === "Snare Drum") {
				this.synth.playSnare(time, this.pan, this.level);
			} else if (this.patch === "Hi-Hat") {
				this.synth.playHiHat(time, this.pan, this.level);
			} else {
				this.synth.play(time, duration, this.pitch, this.pan, this.level);
			}
		}
	}

	getState() {
		const state = {
			patch: this.patch,
			pan: this.pan,
			level: this.level,
			isMute: this.isMute,
			steps: this.sequence.getSteps(),
		};
		return state;
	}

	setState(state) {
		this.patch = state.patch;
		this.$patch.value = this.patch;
		this.synth.loadPatch(this.patch);

		this.pan = state.pan;
		this.$pan.value = this.pan;

		this.level = state.level;
		this.$level.value = this.level;

		this.isMute = state.isMute;
		if (this.isMute) {
			this.$mute.classList.add("channel__mute--active");
		} else {
			this.$mute.classList.remove("channel__mute--active");
		}

		this.sequence.setSteps(state.steps);
	}
}
