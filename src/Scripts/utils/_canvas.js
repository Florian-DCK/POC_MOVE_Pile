/**
 * Upscales a canvas to match the device pixel ratio
 * @param {HTMLElement} canvas - The canvas HTML element
 * @param {Number} width - Desired canvas width, in px
 * @param {Number} height - Desired canvas height, in px
 */

export const scaleCanvas = (ctx, width, height) => {
	const canvas = ctx;
	// assume the device pixel ratio is 1 if the browser doesn't specify it
	const ratio = window.devicePixelRatio || 1;

	if (ratio !== 1) {
		// set the 'real' canvas size to the higher width/height
		canvas.width = width * ratio;
		canvas.height = height * ratio;

		// ...then scale it back down with CSS
		canvas.style.width = `${width}px`;
		canvas.style.height = `${height}px`;
	} else {
		// this is a normal 1:1 device; just scale it simply
		canvas.width = width;
		canvas.height = height;
		canvas.style.width = '';
		canvas.style.height = '';
	}
};
