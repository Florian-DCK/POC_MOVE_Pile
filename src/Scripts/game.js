import gsap from 'gsap';

import ControlsManager from '@hilarious-be/controls-manager';
import EventManager from '@hilarious-be/event-manager';
import Joystick from '@hilarious-be/joystick';
import ParticleEmitter from '@hilarious-be/particle-emitter';
import Timer from '@hilarious-be/timer';

import { logReadyMessage, changeScreen, dispatchCustomEvent } from './utils';
import { config } from './_config';

import './modules/subsidiary';

const lang = document.documentElement.lang === 'fr' ? 'fr' : 'nl';
const imgPath = '../Content/img/';

document.addEventListener('DOMContentLoaded', () => {
	logReadyMessage();

	/**
	 * GAME VARIABLES
	 */

	// screens
	const $sLoader = document.querySelector('.screen--loader');
	const $sIntro = document.querySelector('.screen--intro');
	const $sGame = document.querySelector('.screen--game');
	const $sLost = document.querySelector('.screen--lost');
	const $sWin = document.querySelector('.screen--win');
	const $sSubsidiary = document.querySelector('.screen--subsidiary');

	// intro
	const $startGame = $sIntro.querySelector('.start-game');

	// playground
	const $playground = $sGame.querySelector('.screen--game__playground');

	// ui
	const $ui = $sGame.querySelector('.screen--game__ui');

	// Game
	const Game = {
		active: false,
	};

	/**
	 * LOADER
	 */

	Pace.on('done', () => {
		changeScreen($sLoader, $sIntro);
		Game.init();
	});

	/**
	 * GAME INIT
	 */

	Game.init = () => {
		$startGame.addEventListener('click', () => {
			$startGame.style.pointerEvents = 'none';
			$startGame.blur();
			changeScreen($sIntro, $sGame);
			Game.start();
		});
	};

	/**
	 * GAME START
	 */

	Game.start = () => {
		dispatchCustomEvent('game-start');
	};

	/**
	 * GAME METHODS
	 */

	/**
	 * AFTER GAME
	 */

	Game.win = () => {
		dispatchCustomEvent('game-win');
		Game.active = false;

		setTimeout(() => {
			changeScreen($sGame, $sWin, () => {
				setTimeout(() => {
					changeScreen($sWin, $sSubsidiary);
				}, 3000);
			});
		}, 1000);
	};

	Game.lost = () => {
		dispatchCustomEvent('game-lost');
		Game.active = false;

		setTimeout(() => {
			changeScreen($sGame, $sLost);
		}, 1000);
	};
});
