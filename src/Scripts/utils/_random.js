export const randomBetween = (min, max) => Math.random() * (max - min) + min;
export const randomPosNeg = () => (Math.random() > 0.5 ? 1 : -1);

export const getWeightedArray = (weightMap) =>
	weightMap
		.map(({ 0: value, 1: weight }) => new Array(weight).fill(value))
		.reduce((acc, current) => [...acc, ...current]);

// inspired by https://gist.github.com/oepn/33bc587bc09ce9895c43
export class WeightedRandom {
	constructor(weightMap) {
		this.state = {
			weightMap: [],
		};

		this.weightMap = weightMap;
	}

	get weightMap() {
		return this.state.weightMap;
	}

	set weightMap(weightMap) {
		this.state.weightMap = weightMap;
		this.weightedArray = getWeightedArray(weightMap);
	}

	pick() {
		return this.weightedArray[
			Math.floor(Math.random() * this.weightedArray.length)
		];
	}
}

/**
 * shuffleArray — Returns a shuffled copy of a given array, leaves the original one untouched
 * @param {array} array Any array
 * @param {number} nb (optional) How many times to shuffle the array — defaults to 1
 * @returns {array} The shuffled array
 */
export const shuffleArray = (array, nb = 1) => {
	const newArray = [...array];
	const len = newArray.length;

	for (let i = 0; i < nb; i += 1) {
		let j = len;
		while (j > 0) {
			j -= 1;
			const p = parseInt(Math.random() * len, 10);
			const t = newArray[j];
			newArray[j] = newArray[p];
			newArray[p] = t;
		}
	}

	return newArray;
};
