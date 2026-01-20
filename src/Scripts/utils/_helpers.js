export const logReadyMessage = (message) => {
	// eslint-disable-next-line no-console
	console.log(
		'\n%cMade with %c🤪 %cby %chilarious.be',
		'font-family: Proximus, sans-serif; font-size:18px; font-weight: 300;',
		'font-size:14px;',
		'font-family: Proximus, sans-serif; font-size:18px; font-weight: 300; margin-left: -4px;',
		'font-family: Proximus, sans-serif; font-size:18px; font-weight: 700;',
	);

	if (message) {
		// eslint-disable-next-line no-console
		console.log(message);
	}
};

// Handle tab visibility
export const onWindowVisibilityChange = (callback) => {
	// Set the name of the hidden property and the change event for visibility
	let hidden;
	let visibilityChange;
	if (typeof document.hidden !== 'undefined') {
		// Opera 12.10 and Firefox 18 and later support
		hidden = 'hidden';
		visibilityChange = 'visibilitychange';
	} else if (typeof document.msHidden !== 'undefined') {
		hidden = 'msHidden';
		visibilityChange = 'msvisibilitychange';
	} else if (typeof document.webkitHidden !== 'undefined') {
		hidden = 'webkitHidden';
		visibilityChange = 'webkitvisibilitychange';
	}

	if (
		typeof document.addEventListener !== 'undefined' &&
		hidden !== undefined
	) {
		document.addEventListener(
			visibilityChange,
			() => {
				callback(document[hidden]);
			},
			false,
		);
	}

	window.addEventListener('blur', () => {
		callback(true);
	});

	window.addEventListener('focus', () => {
		callback(false);
	});
};

export const isEven = (n) => n % 2 === 0;

export const isOdd = (n) => n % 2 !== 0;

export const isDomElement = (element) =>
	element instanceof Element || element instanceof Document;

export const getDomElement = (el) => {
	if (isDomElement(el)) {
		return el;
	}
	if (typeof el === 'string') {
		return document.querySelector(el);
	}
	return null;
};

export const getAllDomElements = (el) => {
	if (isDomElement(el)) {
		return el;
	}
	if (typeof el === 'string') {
		return document.querySelectorAll(el);
	}
	return null;
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

export const mapRange = (val, aIn, bIn, aOut, bOut) => {
	return ((val - aIn) * (bOut - aOut)) / (bIn - aIn) + aOut;
};

export const mapPercent = (val, a, b) => mapRange(val, 0, 100, a, b);

export const toRad = (angle) => angle * (Math.PI / 180);
export const toDeg = (angle) => angle * (180 / Math.PI);

export const loopNumber = (num, min, max, step = 1) => {
	let nb = num;
	nb += step;

	if (nb > max) {
		nb = min;
	}

	if (nb < min) {
		nb = max;
	}

	return nb;
};

export const injectScript = (src) => {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script');
		script.src = src;
		script.addEventListener('load', resolve);
		script.addEventListener('error', (e) => reject(e.error));
		document.head.appendChild(script);
	});
};
