export const breakpoints = {
	small: 375, // recent phones
	medsmall: 414, // phones landscape
	medium: 768, // tablets portrait
	medlarge: 992, // tablets landscape / small laptops
	large: 1200, // laptops / small desktops
	xlarge: 1440, // desktops
	xxlarge: 1600, // large desktops
	fhd: 1920, // full HD+
};

const getMediaQueryString = (breakpoint, isLandscape) => {
	const w = breakpoint in breakpoints ? breakpoints[breakpoint] : breakpoint;
	const l = isLandscape ? ' and (orientation: landscape)' : '';
	return `screen and (min-width: ${w}px)${l}`;
};

/**
 * setBreakpointListener — Creates a listener that calls a function when the listener
 * @param {(string|number)} breakpoint - Either a string representing the defined breakpoints or a number to use directly as px value.
 * @param {function} callback - The function called when the breakpoint is triggered. Receives the MediaQueryList interface.
 * @param {boolean} [isLandscape=true] - Whether or not the breakpoint is also conditioned by the screen orientation.
 * @example
 * setBreakpointListener('medlarge', (bp) => {
 *   if (bp.matches) {
 *     // do A
 *   } else {
 *     // do B
 *   }
 * })
 */
export const setBreakpointListener = (
	breakpoint,
	callback,
	isLandscape = true,
) => {
	const mql = window.matchMedia(getMediaQueryString(breakpoint, isLandscape));
	mql.addEventListener('change', callback);
};

/**
 * respondTo — Matches the media query defined by the given breakpoint.
 * @param {(string|number)} breakpoint - Either a string representing the defined breakpoints or a number to use directly as px value.
 * @param {boolean} [isLandscape=true] - Whether or not the breakpoint is also conditioned by the screen orientation
 * @returns {boolean}
 */
export const respondTo = (breakpoint, isLandscape = true) => {
	return window.matchMedia(getMediaQueryString(breakpoint, isLandscape))
		.matches;
};
