import gsap from 'gsap';

import ControlsManager from '@hilarious-be/controls-manager';
import EventManager from '@hilarious-be/event-manager';
import Joystick from '@hilarious-be/joystick';
import ParticleEmitter from '@hilarious-be/particle-emitter';
import Timer from '@hilarious-be/timer';

import { logReadyMessage, changeScreen, dispatchCustomEvent } from './utils';
import { config } from './_config';

import './modules/subsidiary';
import { createPhaserGame } from './modules/phaser-game';

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
	const $canvas = $playground.querySelector('#game-canvas');

	// ui
	const $ui = $sGame.querySelector('.screen--game__ui');

	// Game
	const Game = {
		active: false,
		phaser: null,
	};

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
	 * LOADER
	 */

	const handleLoaderDone = () => {
		changeScreen($sLoader, $sIntro);
		Game.init();
	};

	const isDev =
		window.location.hostname === 'localhost' ||
		window.location.hostname === '127.0.0.1' ||
		window.location.search.includes('dev=1');

	if (isDev) {
		const paceEl = document.querySelector('.pace');
		if (paceEl) {
			paceEl.classList.add('pace-inactive');
		}
		if (window.Pace && typeof window.Pace.stop === 'function') {
			window.Pace.stop();
		}
		if (window.Pace && window.Pace.bar && typeof window.Pace.bar.finish === 'function') {
			window.Pace.bar.finish();
		}
		changeScreen($sLoader, $sGame, () => {
			Game.start();
		});
	} else if (window.Pace && typeof window.Pace.on === 'function') {
		window.Pace.on('done', handleLoaderDone);
	} else {
		handleLoaderDone();
	}

	/**
	 * GAME START
	 */

	Game.start = () => {
		if (!Game.phaser && $canvas) {
			Game.phaser = createPhaserGame($canvas);
		}
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
