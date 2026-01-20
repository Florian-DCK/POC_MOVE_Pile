const defaultScreenTransition = (prevScreen, nextScreen, callback) => {
	if (prevScreen) {
		prevScreen.classList.remove('screen-visible');
	}

	if (nextScreen) {
		nextScreen.classList.add('screen-visible');
	}

	setTimeout(() => {
		callback();
	}, 400);
};

/**
 * changeScreen — Fades out the currently visible screen and fades in the new one — Relies on having window.currentScreen declared before use
 * @param {(jQueryObject | string)} screen The screen you want to fade in. If string is provided, it is used as query selector
 * @param {function} callback Optional callback called after the screen toggle animation
 */

export const changeScreen = (
	prevScreen,
	nextScreen,
	callback = () => {},
	animation = defaultScreenTransition,
) => {
	let oldScreen = prevScreen;
	let newScreen = nextScreen;

	if (typeof prevScreen === 'string') {
		oldScreen = document.querySelector(prevScreen);
	}

	if (typeof nextScreen === 'string') {
		newScreen = document.querySelector(nextScreen);
	}

	animation(oldScreen, newScreen, callback);
};
