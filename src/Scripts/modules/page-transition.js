import { getDomElement } from '../utils/helpers';

export const pageTransition = (el = '.page-transition') => {
	const elem = getDomElement(el);
	elem.classList.remove('no-transition');

	return {
		el: elem,
		in: (callback) => {
			elem.classList.add('active');
			setTimeout(() => {
				callback();
			}, 650);
		},
		out: () => {
			elem.classList.add('right');
			setTimeout(() => {
				elem.classList.remove('active');
				elem.classList.remove('right');
			}, 1000);
		},
	};
};
