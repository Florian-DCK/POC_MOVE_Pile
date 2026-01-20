/**
 * dispatchCustomEvent
 * @param {string} evName custom event name
 * @param {*} evData data passed to it
 */
export const dispatchCustomEvent = (evName, evData = {}) => {
	window.dispatchEvent(new CustomEvent(evName, { detail: evData }));
};

/**
 * listenCustomEvent
 * @param {string} evName custom event to listen to
 * @param {function(Event, *)} callback eventListener callback that directly receives the event data as second parameter
 */
export const listenCustomEvent = (evName, callback) => {
	window.addEventListener(evName, (ev) => {
		callback(ev, ev.detail);
	});
};
