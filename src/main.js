import Sequencer from "./sequencer/sequencer.js";
import KeyboardSynth from "./synth/keyboard-synth.js";

class Hotstepper {
	constructor() {
		this.context = new AudioContext();
		this.sequencer = new Sequencer(this.context, 8, 64);
		this.synth = new KeyboardSynth(this.context);

		this.$sequencer = document.querySelector(".sequencer");
		this.$synth = document.querySelector(".synth");
		this.$navSequencer = document.querySelector(".app__nav-sequencer");
		this.$navSynth = document.querySelector(".app__nav-synth");

		this.$navSequencer.addEventListener("click", this.displaySequencer.bind(this));
		this.$navSynth.addEventListener("click", this.displaySynth.bind(this));

		window.addEventListener("beforeunload", this.saveState.bind(this));
		this.loadState();
	}

	displaySequencer() {
		this.$sequencer.classList.add("sequencer--active");
		this.$synth.classList.remove("synth--active");
		this.$navSequencer.classList.add("app__nav-sequencer--active");
		this.$navSynth.classList.remove("app__nav-synth--active");

		this.sequencer.channelList.forEach((channel) => {
			channel.synth.reloadPatch();
		});
	}

	displaySynth() {
		this.$synth.classList.add("synth--active");
		this.$sequencer.classList.remove("sequencer--active");
		this.$navSynth.classList.add("app__nav-synth--active");
		this.$navSequencer.classList.remove("app__nav-sequencer--active");
	}

	saveState() {
		const sequencerState = this.sequencer.getState();
		localStorage.setItem("SEQUENCER", JSON.stringify(sequencerState));
	}

	loadState() {
		const sequencerState = JSON.parse(localStorage.getItem("SEQUENCER"));
		if (sequencerState) {
			this.sequencer.setState(sequencerState);
		}
	}
}

const hotstepper = new Hotstepper();
