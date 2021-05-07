class Queue {
	constructor(maxSize) {
		this.items = new Array(maxSize).fill(null);
		this.maxSize = maxSize;
		this.size = 0;
		this.head = 0;
		this.tail = 0;
	}

	get length() {
		return this.size;
	}

	getHead() {
		return this.items[this.head];
	}

	enqueue(item) {
		if (this.size < this.maxSize) {
			this.items[this.tail] = item;
			this.size += 1;
			this.tail += 1;
			this.tail %= this.maxSize;
		} else {
			console.log("Queue is full.");
		}
	}

	dequeue() {
		if (this.size > 0) {
			const item = this.items[this.head];
			this.items[this.head] = null;
			this.size -= 1;
			this.head += 1;
			this.head %= this.maxSize;
			return item;
		} else {
			console.log("Queue is empty.");
		}
	}
}

export default class StepQueue extends Queue {
	constructor(stepCount) {
		super(stepCount);
	}

	enqueue(step, time) {
		super.enqueue({ step, time });
	}
}
