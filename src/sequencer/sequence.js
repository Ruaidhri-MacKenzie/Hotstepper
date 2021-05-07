export default class Sequence {
	constructor(context, index, stepCount) {
		this.context = context;
		this.index = index;
		this.steps = [];

		this.$element = document.getElementById(`sequence${this.index}`);
		this.$steps = [];

		let $bar = null;
		for (let i = 0; i < stepCount; i++) {
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
			this.$steps.push($step);
		}
	}

	toggleStep(event) {
		const $step = event.target;
		$step.classList.toggle("step--active");

		const index = $step.dataset.index;
		this.steps[index] = !this.steps[index];
	}

	getSteps() {
		return this.steps;
	}

	setSteps(steps) {
		this.steps = steps;

		this.$steps.forEach(($step, index) => {
			if (index < this.steps.length) {
				const stepActive = this.steps[index];
				if (stepActive) {
					$step.classList.add("step--active");
				} else {
					$step.classList.remove("step--active");
				}
			}
		});
	}
}
