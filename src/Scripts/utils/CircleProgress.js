import { getDomElement } from './index';

export default class CircleProgress {
	constructor(container, options = {}) {
		this.NS = 'http://www.w3.org/2000/svg';
		this.container = getDomElement(container);
		this.startValue = options.startValue || 0;
		this.strokeWidth = options.strokeWidth || 2;
		this.backStrokeWidth = options.backStrokeWidth || 0;
		this.circles = {
			filler: null,
			back: null,
		};
		this.state = {
			value: this.startValue,
		};

		this.createSVG();
		if (this.backStrokeWidth > 0) {
			this.createCircle('back');
		}
		this.createCircle('filler');

		this.value = this.startValue;
	}

	get value() {
		return this.state.value;
	}

	set value(val) {
		this.state.value = val;
		this.setCirclePercentage(val);
	}

	get circleLength() {
		return 2 * Math.PI * this.circles.filler.r;
	}

	createSVG() {
		this.svg = document.createElementNS(this.NS, 'svg');
		this.container.appendChild(this.svg);

		const bbox = this.svg.getBoundingClientRect();
		this.width = bbox.width;
		this.height = bbox.height;

		this.svg.setAttributeNS(
			null,
			'viewBox',
			`0 0 ${this.width} ${this.height}`,
		);
	}

	createCircle(name) {
		const circle = {
			el: document.createElementNS(this.NS, 'circle'),
			cx: this.width / 2,
			cy: this.height / 2,
			r: Math.min(this.width, this.height) / 2 - this.strokeWidth / 2,
		};

		circle.el.setAttributeNS(null, 'cx', circle.cx);
		circle.el.setAttributeNS(null, 'cy', circle.cy);
		circle.el.setAttributeNS(null, 'r', circle.r);
		circle.el.classList.add(name);
		circle.el.style.strokeWidth =
			name === 'filler' ? this.strokeWidth : this.backStrokeWidth;

		this.svg.appendChild(circle.el);
		this.circles[name] = circle;

		if (name !== 'filler') return;
		circle.el.style.strokeDasharray = this.circleLength;
	}

	setCirclePercentage(p, duration = null) {
		const percent = Math.min(Math.max(p, 0), 100);

		var offset = ((100 - percent) / 100) * this.circleLength;

		if (duration !== null) {
			this.circles.filler.el.style.transitionDuration = `${duration}s`;
		}
		this.circles.filler.el.style.strokeDashoffset = offset;
		if (duration !== null) {
			setTimeout(() => {
				this.circles.filler.el.style.removeProperty('transition-duration');
			}, 10);
		}
	}
}
