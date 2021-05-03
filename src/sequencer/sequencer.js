import { TEMPO, CHANNEL_COUNT, STEP_COUNT, LOOKAHEAD, SCHEDULE_AHEAD_TIME } from "../constants.js";
import Channel from "./channel.js";
import StepQueue from "./queue.js";

export default class Sequencer {
	constructor(context) {
		this.context = context;

		// Channels
		this.$channelTemplate = document.querySelector("#channel-template");
		this.$channelList = document.querySelector(".channel-list__controls");
		this.$sequenceList = document.querySelector(".channel-list__sequences");
		this.channelList = [];
		for (let i = 0; i < CHANNEL_COUNT; i++) {
			this.addChannel(i);
		}

		// Playback
		this.$play = document.querySelector(".playback__play");
		this.$playLabel = document.querySelector(".playback__play-label");
		this.$stop = document.querySelector(".playback__stop");
		this.$tempo = document.querySelector(".playback__tempo");

		this.$play.addEventListener("click", this.play.bind(this));
		this.$stop.addEventListener("click", this.stop.bind(this));
		this.$tempo.addEventListener("input", this.setTempo.bind(this));

		this.tempo = TEMPO.default; // in bpm
		this.currentStep = 0;
		this.nextStepTime = 0;
		this.lastStepDrawn = 1;
		this.stepQueue = new StepQueue();
		this.isPlaying = false;

		this.soloChannel = null;
	}

	setSolo(channelIndex) {
		const $soloButtons = document.querySelectorAll(".channel__solo");
		$soloButtons.forEach(($solo) => $solo.classList.remove("channel__solo--active"));

		if (this.soloChannel === channelIndex) {
			this.soloChannel = null;
		} else {
			this.soloChannel = channelIndex;
			$soloButtons[channelIndex].classList.add("channel__solo--active");
		}
	}

	addChannel(index) {
		const $channel = this.$channelTemplate.content.cloneNode(true).firstElementChild;
		$channel.setAttribute("id", `channel${index}`);
		this.$channelList.appendChild($channel);

		const $sequence = document.createElement("div");
		$sequence.classList.add("channel__sequence");
		$sequence.setAttribute("id", `sequence${index}`);
		this.$sequenceList.appendChild($sequence);

		const channel = new Channel(this.context, index, this.setSolo.bind(this));
		this.channelList.push(channel);
	}

	setTempo() {
		const tempo = parseInt(this.$tempo.value, 10);

		if (isNaN(tempo)) this.tempo = TEMPO.default;
		else if (tempo < TEMPO.min) this.tempo = TEMPO.min;
		else if (tempo > TEMPO.max) this.tempo = TEMPO.max;
		else this.tempo = tempo;

		this.$tempo.value = this.tempo;
	}

	nextStep() {
		const secondsPerBeat = 60 / this.tempo;
		const secondsPerStep = secondsPerBeat / 4;
		this.nextStepTime += secondsPerStep;
		this.currentStep += 1;
		this.currentStep %= STEP_COUNT;
	}

	scheduleStep(step, time) {
		this.stepQueue.enqueue(step, time);

		const beatsPerSecond = this.tempo / 60;
		const secondsPerBeat = 1 / beatsPerSecond;
		const secondsPerStep = secondsPerBeat / 4;

		if (this.soloChannel != null) {
			const channel = this.channelList[this.soloChannel];
			channel.play(step, time, secondsPerStep);
		} else {
			this.channelList.forEach((channel) => {
				channel.play(step, time, secondsPerStep);
			});
		}
	}

	drawSteps() {
		if (!this.isPlaying) return;

		let drawStep = this.lastStepDrawn;
		let currentTime = this.context.currentTime;

		while (this.stepQueue.length && this.stepQueue.getHead().time < currentTime) {
			drawStep = this.stepQueue.getHead().step;
			this.stepQueue.dequeue();
		}

		if (this.lastStepDrawn != drawStep) {
			const $sequences = document.querySelectorAll(".channel__sequence");

			$sequences.forEach(($sequence) => {
				const $steps = $sequence.querySelectorAll(".step");
				$steps[this.lastStepDrawn].classList.remove("step--playing");
				$steps[drawStep].classList.add("step--playing");
			});

			this.lastStepDrawn = drawStep;
		}

		requestAnimationFrame(this.drawSteps.bind(this));
	}

	scheduler() {
		while (this.nextStepTime < this.context.currentTime + SCHEDULE_AHEAD_TIME) {
			this.scheduleStep(this.currentStep, this.nextStepTime);
			this.nextStep();
		}
		this.timerID = setTimeout(this.scheduler.bind(this), LOOKAHEAD);
	}

	play() {
		if (this.isPlaying) {
			this.pause();
			return;
		}

		this.isPlaying = true;

		this.$play.textContent = "⏸";
		this.$playLabel.textContent = "Pause";

		this.nextStepTime = this.context.currentTime;
		this.scheduler();
		requestAnimationFrame(this.drawSteps.bind(this));
	}

	pause() {
		if (!this.isPlaying) return;

		this.isPlaying = false;
		clearTimeout(this.timerID);
		this.$play.textContent = "▶";
		this.$playLabel.textContent = "Play";
	}

	stop() {
		this.pause();

		this.currentStep = 0;
		const $sequences = document.querySelectorAll(".channel__sequence");
		$sequences.forEach(($sequence) => {
			const $steps = $sequence.querySelectorAll(".step");
			$steps[this.lastStepDrawn].classList.remove("step--playing");
		});
	}
}
