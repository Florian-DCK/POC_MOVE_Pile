import * as THREE from 'three';

import { logReadyMessage, changeScreen, dispatchCustomEvent } from './utils';

import './modules/subsidiary';

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

	const state = {
		renderer: null,
		scene: null,
		camera: null,
		clock: null,
		stackGroup: null,
		stack: [],
		currentBlock: null,
		movingDirection: 1,
		isDropping: false,
		isFallingTower: false,
		baseSpeed: 2.4,
		speed: 2.4,
		dropSpeed: 12,
		gravity: 26,
		perfectTolerance: 0.12,
		towerLean: 0,
		towerLeanVelocity: 0,
		streak: 0,
		score: 0,
		maxHeight: 0,
	};

	const settings = {
		baseWidth: 6,
		baseDepth: 4,
		blockHeight: 1,
		minWidth: 2.4,
		minDepth: 2,
		maxWidth: 6.4,
		maxDepth: 4.6,
		moveLimit: 7.2,
		maxOffsetRatio: 0.42,
		colorPalette: [0xf5c16c, 0xf18f6c, 0x9ed6c2, 0x88b6e8, 0xf0b1d5],
	};

	const uiRefs = {
		score: null,
		streak: null,
		speed: null,
		message: null,
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
		Game.active = true;
		setupUI();
		setupThree();
		resetGame();
		startLoop();
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

	const setupUI = () => {
		$ui.innerHTML = `
			<div class="game-ui">
				<div class="game-ui__row">
					<div class="game-ui__stat">Score: <span class="js-score">0</span></div>
					<div class="game-ui__stat">Serie: <span class="js-streak">0</span></div>
					<div class="game-ui__stat">Vitesse: <span class="js-speed">0</span></div>
				</div>
				<div class="game-ui__message js-message">
					Cliquez ou Espace pour poser le carton. Tap sur mobile.
				</div>
			</div>
		`;

		uiRefs.score = $ui.querySelector('.js-score');
		uiRefs.streak = $ui.querySelector('.js-streak');
		uiRefs.speed = $ui.querySelector('.js-speed');
		uiRefs.message = $ui.querySelector('.js-message');
	};

	const setupThree = () => {
		if (state.renderer) {
			return;
		}

		state.scene = new THREE.Scene();
		state.scene.background = new THREE.Color(0x0e1b2b);
		state.clock = new THREE.Clock();

		const { clientWidth, clientHeight } = $playground;
		state.camera = new THREE.PerspectiveCamera(45, clientWidth / clientHeight, 0.1, 100);
		state.camera.position.set(0, 8, 12);
		state.camera.lookAt(0, 3, 0);

		state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		state.renderer.setPixelRatio(window.devicePixelRatio || 1);
		state.renderer.setSize(clientWidth, clientHeight);
		$playground.innerHTML = '';
		$playground.appendChild(state.renderer.domElement);

		const ambient = new THREE.AmbientLight(0xffffff, 0.7);
		const key = new THREE.DirectionalLight(0xffffff, 0.8);
		key.position.set(6, 10, 4);
		state.scene.add(ambient, key);

		window.addEventListener('resize', handleResize);
		window.addEventListener('pointerdown', handleDrop, { passive: false });
		window.addEventListener('keydown', handleKeydown);
	};

	const resetGame = () => {
		clearScene();
		state.stack = [];
		state.currentBlock = null;
		state.movingDirection = Math.random() > 0.5 ? 1 : -1;
		state.isDropping = false;
		state.isFallingTower = false;
		state.speed = state.baseSpeed;
		state.towerLean = 0;
		state.towerLeanVelocity = 0;
		state.streak = 0;
		state.score = 0;
		state.maxHeight = 0;
		state.stackGroup = new THREE.Group();
		state.scene.add(state.stackGroup);

		createBaseBlock();
		spawnNextBlock();
		updateUI();
	};

	const clearScene = () => {
		if (!state.scene) return;
		while (state.scene.children.length > 0) {
			state.scene.remove(state.scene.children[0]);
		}
		const ambient = new THREE.AmbientLight(0xffffff, 0.7);
		const key = new THREE.DirectionalLight(0xffffff, 0.8);
		key.position.set(6, 10, 4);
		state.scene.add(ambient, key);
	};

	const createBaseBlock = () => {
		const base = createBlock({
			width: settings.baseWidth,
			depth: settings.baseDepth,
			height: settings.blockHeight,
			color: 0x6f7c91,
			x: 0,
			y: settings.blockHeight / 2,
			addToGroup: true,
		});
		state.stack.push(base);
	};

	const spawnNextBlock = () => {
		const prev = state.stack[state.stack.length - 1];
		const width = clamp(
			prev.width + (Math.random() * 1.8 - 0.9),
			settings.minWidth,
			settings.maxWidth,
		);
		const depth = clamp(
			prev.depth + (Math.random() * 1.2 - 0.6),
			settings.minDepth,
			settings.maxDepth,
		);
		const color =
			settings.colorPalette[state.stack.length % settings.colorPalette.length];
		const startX = state.movingDirection === 1 ? -settings.moveLimit : settings.moveLimit;
		const y = prev.mesh.position.y + settings.blockHeight;
		state.currentBlock = createBlock({
			width,
			depth,
			height: settings.blockHeight,
			color,
			x: startX,
			y,
			addToGroup: false,
		});
		state.isDropping = false;
		state.speed = state.baseSpeed + state.stack.length * 0.2;
		updateUI();
	};

	const createBlock = ({ width, depth, height, color, x, y, addToGroup }) => {
		const geometry = new THREE.BoxGeometry(width, height, depth);
		const material = new THREE.MeshStandardMaterial({
			color,
			roughness: 0.5,
			metalness: 0.1,
		});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(x, y, 0);
		if (addToGroup && state.stackGroup) {
			state.stackGroup.add(mesh);
		} else {
			state.scene.add(mesh);
		}
		return {
			mesh,
			width,
			depth,
			height,
			color,
		};
	};

	const handleResize = () => {
		if (!state.renderer || !state.camera) return;
		const { clientWidth, clientHeight } = $playground;
		state.camera.aspect = clientWidth / clientHeight;
		state.camera.updateProjectionMatrix();
		state.renderer.setSize(clientWidth, clientHeight);
	};

	const handleDrop = (event) => {
		if (!Game.active || state.isFallingTower || !state.currentBlock || state.isDropping) return;
		if (event) {
			event.preventDefault();
		}
		state.isDropping = true;
	};

	const handleKeydown = (event) => {
		if (event.code === 'Space') {
			handleDrop(event);
		}
	};

	const landBlock = () => {
		const prev = state.stack[state.stack.length - 1];
		const current = state.currentBlock;
		if (!prev || !current) return;

		const dx = current.mesh.position.x - prev.mesh.position.x;
		const maxOffset = (prev.width / 2) * settings.maxOffsetRatio;
		if (Math.abs(dx) > maxOffset) {
			triggerTowerFall();
			return;
		}

		if (state.stackGroup && !state.stackGroup.children.includes(current.mesh)) {
			state.scene.remove(current.mesh);
			state.stackGroup.add(current.mesh);
		}
		state.stack.push(current);
		state.currentBlock = null;

		if (Math.abs(dx) <= state.perfectTolerance) {
			state.streak += 1;
		} else {
			state.streak = 0;
		}

		state.score = state.stack.length - 1;
		if (state.streak >= 3) {
			state.score += state.streak;
		}

		state.movingDirection *= -1;
		state.maxHeight = Math.max(
			state.maxHeight,
			current.mesh.position.y + settings.blockHeight,
		);
		updateUI(true);
		spawnNextBlock();
	};

	const updateUI = (showBonus = false) => {
		if (!uiRefs.score) return;
		uiRefs.score.textContent = `${state.score}`;
		uiRefs.streak.textContent = `${state.streak}`;
		uiRefs.speed.textContent = `${state.speed.toFixed(1)}`;
		if (showBonus && state.streak >= 3) {
			uiRefs.message.textContent = `Bonus stabilite x${state.streak}!`;
		} else if (uiRefs.message && Game.active) {
			uiRefs.message.textContent = `Equilibrez la pile. Clic ou Espace pour poser. Tap sur mobile.`;
		}
	};

	const updateCamera = () => {
		const targetY = Math.max(6, state.maxHeight + 2.5);
		state.camera.position.y += (targetY - state.camera.position.y) * 0.05;
		state.camera.lookAt(0, state.camera.position.y - 4, 0);
	};

	const updateMovingBlock = (delta) => {
		if (!state.currentBlock || state.isFallingTower) return;
		if (state.isDropping) {
			const target = state.stack[state.stack.length - 1];
			const targetY = target.mesh.position.y + settings.blockHeight;
			state.currentBlock.mesh.position.y -= state.dropSpeed * delta;
			if (state.currentBlock.mesh.position.y <= targetY) {
				state.currentBlock.mesh.position.y = targetY;
				state.isDropping = false;
				landBlock();
			}
			return;
		}

		state.currentBlock.mesh.position.x += state.movingDirection * state.speed * delta;
		if (Math.abs(state.currentBlock.mesh.position.x) > settings.moveLimit) {
			state.movingDirection *= -1;
		}
	};

	const updateTowerBalance = (delta) => {
		if (state.isFallingTower || !state.stack.length || !state.stackGroup) return;
		const com = state.stack.reduce((acc, block) => acc + block.mesh.position.x, 0) / state.stack.length;
		const targetLean = THREE.MathUtils.clamp(com * 0.12, -0.35, 0.35);
		const spring = 8;
		const damping = 2.4;
		const leanDelta = (targetLean - state.towerLean) * spring - state.towerLeanVelocity * damping;
		state.towerLeanVelocity += leanDelta * delta;
		state.towerLean += state.towerLeanVelocity * delta;
		state.stackGroup.rotation.z = state.towerLean;

		if (Math.abs(state.towerLean) > 0.38) {
			triggerTowerFall();
		}
	};

	const triggerTowerFall = () => {
		if (state.isFallingTower) return;
		state.isFallingTower = true;
		if (state.currentBlock) {
			state.scene.remove(state.currentBlock.mesh);
			state.currentBlock = null;
		}
		state.isDropping = false;
		uiRefs.message.textContent = `La tour bascule !`;
	};

	const updateTowerFall = (delta) => {
		if (!state.isFallingTower || !state.stackGroup) return;
		state.stackGroup.rotation.z += 1.4 * delta * Math.sign(state.towerLean || 1);
		state.stackGroup.position.y -= state.gravity * 0.6 * delta;
		if (state.stackGroup.position.y < -8) {
			Game.lost();
		}
	};

	const startLoop = () => {
		const animate = () => {
			if (!state.renderer || !state.scene || !state.camera) return;
			const delta = state.clock.getDelta();
			if (Game.active) {
				updateMovingBlock(delta);
				updateTowerBalance(delta);
				updateTowerFall(delta);
				updateCamera();
			}
			state.renderer.render(state.scene, state.camera);
			requestAnimationFrame(animate);
		};
		animate();
	};

	const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
});
