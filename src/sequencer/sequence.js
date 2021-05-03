import { STEP_COUNT } from "../constants.js";

export default class Sequence {
	constructor(context, index) {
		this.context = context;
		this.index = index;
		this.steps = [];

		this.$element = document.getElementById(`sequence${this.index}`);

		let $bar = null;
		for (let i = 0; i < STEP_COUNT; i++) {
			this.steps.push(false);

			if (i % 16 === 0) {
				$bar = document.createElement("div");
				$bar.classList.add("bar");
				this.$element.appendChild($bar);
			}

			const $step = document.createElement("div");
			$step.classList.add("step");
			$step.setAttribute("data-index", i);
			$step.addEventListener("click", this.toggleStep.bind(this));

			$bar.appendChild($step);
		}
	}

	toggleStep(event) {
		const $step = event.target;
		$step.classList.toggle("step--active");

		const index = $step.dataset.index;
		this.steps[index] = !this.steps[index];
	}
}
