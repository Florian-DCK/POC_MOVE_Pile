import Phaser from 'phaser';

const BASE_WIDTH = 480;
const BOX_TYPES = [
	{ width: 90, height: 40, weight: 1, color: 0xe9c46a, label: 'S' },
	{ width: 130, height: 50, weight: 1.2, color: 0xf4a261, label: 'M' },
	{ width: 170, height: 60, weight: 1.5, color: 0xe76f51, label: 'L' },
	{ width: 150, height: 70, weight: 1.8, color: 0x2a9d8f, label: 'H' },
];

const createUiText = (scene, x, y, text, size = 18) =>
	scene.add.text(x, y, text, {
		fontFamily: '"Bebas Neue", "Trebuchet MS", Arial, sans-serif',
		fontSize: `${size}px`,
		color: '#f4f1de',
	}).setDepth(10);

export const createPhaserGame = (canvas) => {
	const parent = canvas.parentElement;
	const gameState = {
		lives: 3,
		score: 0,
		streak: 0,
		stability: 1,
		height: 0,
	};

	const config = {
		type: Phaser.CANVAS,
		canvas,
		backgroundColor: '#0f131a',
		scale: {
			mode: Phaser.Scale.RESIZE,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			width: parent.clientWidth,
			height: parent.clientHeight,
		},
		scene: {
			preload() {},
			create() {
				const scene = this;
				const stack = [];
				let movingBox = null;
				let state = 'moving';
				let direction = Phaser.Math.RND.pick([-1, 1]);
				let speed = 90;
				let dropSpeed = 420;

				const uiLives = createUiText(scene, 20, 18, '');
				const uiScore = createUiText(scene, 20, 42, '');
				const uiHeight = createUiText(scene, 20, 66, '');
				const uiStability = createUiText(scene, 20, 90, '');
				const hint = createUiText(scene, 20, 120, 'Clique / Espace pour larguer', 16);

				const overlay = scene.add.rectangle(0, 0, 10, 10, 0x0f131a, 0.85)
					.setOrigin(0, 0)
					.setDepth(20)
					.setVisible(false);
				const overlayText = createUiText(scene, 0, 0, '', 28).setDepth(21).setVisible(false);

				const resizeOverlay = () => {
					const { width, height } = scene.scale;
					overlay.setSize(width, height);
					overlayText.setPosition(width * 0.5, height * 0.5).setOrigin(0.5);
				};
				scene.scale.on('resize', resizeOverlay);
				resizeOverlay();

				const updateUi = () => {
					uiLives.setText(`Vies: ${gameState.lives}`);
					uiScore.setText(`Score: ${gameState.score}`);
					uiHeight.setText(`Hauteur: ${gameState.height} cartons`);
					uiStability.setText(`Stabilite: ${Math.round(gameState.stability * 100)}%`);
				};

				const getScale = () => scene.scale.width / BASE_WIDTH;
				const groundY = () => scene.scale.height - 60;

				const spawnBox = () => {
					const scale = getScale();
					const type = Phaser.Utils.Array.GetRandom(BOX_TYPES);
					const width = Math.round(type.width * scale);
					const height = Math.round(type.height * scale);
					const y = (stack.length === 0 ? groundY() : stack[stack.length - 1].y - stack[stack.length - 1].height / 2) - height / 2 - 70;
					const minX = 40 + width / 2;
					const maxX = scene.scale.width - 40 - width / 2;
					const x = direction === 1 ? minX : maxX;

					const rect = scene.add.rectangle(x, y, width, height, type.color).setDepth(5);
					const label = scene.add.text(x, y - 8, type.label, {
						fontFamily: '"Bebas Neue", "Trebuchet MS", Arial, sans-serif',
						fontSize: `${Math.max(14, Math.round(18 * scale))}px`,
						color: '#0f131a',
					}).setDepth(6).setOrigin(0.5);

					movingBox = {
						rect,
						label,
						width,
						height,
						weight: type.weight,
						x,
						y,
						state: 'moving',
					};
				};

				const settleBox = () => {
					if (!movingBox) return;
					const top = stack[stack.length - 1] || null;
					const targetY = top
						? top.y - top.height / 2 - movingBox.height / 2
						: groundY() - movingBox.height / 2;

					movingBox.y = targetY;
					movingBox.rect.setPosition(movingBox.x, movingBox.y);
					movingBox.label.setPosition(movingBox.x, movingBox.y - 8);

					let alignmentScore = 1;
					if (top) {
						const dx = movingBox.x - top.x;
						const allowed = top.width * 0.5;
						const distance = Math.abs(dx);
						if (distance > allowed) {
							return false;
						}
						alignmentScore = 1 - distance / allowed;
					}

					if (alignmentScore > 0.9) {
						gameState.streak += 1;
						gameState.stability = Math.min(1, gameState.stability + 0.12);
						gameState.score += 10 + gameState.streak * 2;
					} else {
						gameState.streak = 0;
						gameState.score += 10;
						gameState.stability = Math.max(0, gameState.stability - (1 - alignmentScore) * 0.45);
					}

					stack.push(movingBox);
					movingBox = null;
					gameState.height = stack.length;

					if (gameState.stability <= 0) {
						return 'collapse';
					}
					return true;
				};

				const dropMiss = () => {
					if (!movingBox) return;
					const fall = scene.tweens.add({
						targets: [movingBox.rect, movingBox.label],
						y: scene.scale.height + 120,
						rotation: Phaser.Math.FloatBetween(-0.4, 0.4),
						duration: 600,
						ease: 'Cubic.easeIn',
						onComplete: () => {
							movingBox.rect.destroy();
							movingBox.label.destroy();
						},
					});
					movingBox = null;
					return fall;
				};

				const collapseStack = () => {
					stack.forEach((box, index) => {
						scene.tweens.add({
							targets: [box.rect, box.label],
							y: scene.scale.height + 140,
							rotation: Phaser.Math.FloatBetween(-0.6, 0.6),
							delay: index * 40,
							duration: 600,
							ease: 'Cubic.easeIn',
						});
					});
					stack.length = 0;
					gameState.stability = 1;
				};

				const loseLife = (reason) => {
					gameState.lives -= 1;
					gameState.streak = 0;
					gameState.stability = Math.max(0.4, gameState.stability - 0.25);
					updateUi();

					if (reason === 'collapse') {
						collapseStack();
					}

					if (gameState.lives <= 0) {
						state = 'over';
						overlay.setVisible(true);
						overlayText
							.setText('Pile detruite\nTap pour rejouer')
							.setVisible(true);
					} else {
						state = 'moving';
						direction *= -1;
						speed = Math.min(240, speed + 8);
						spawnBox();
					}
				};

				const resetGame = () => {
					stack.forEach((box) => {
						box.rect.destroy();
						box.label.destroy();
					});
					stack.length = 0;
					if (movingBox) {
						movingBox.rect.destroy();
						movingBox.label.destroy();
						movingBox = null;
					}
					gameState.lives = 3;
					gameState.score = 0;
					gameState.streak = 0;
					gameState.stability = 1;
					gameState.height = 0;
					speed = 90;
					direction = Phaser.Math.RND.pick([-1, 1]);
					state = 'moving';
					overlay.setVisible(false);
					overlayText.setVisible(false);
					updateUi();
					spawnBox();
				};

				scene.input.keyboard.on('keydown-SPACE', () => {
					if (state === 'over') {
						resetGame();
						return;
					}
					if (state !== 'moving' || !movingBox) return;
					state = 'dropping';
					movingBox.state = 'dropping';
				});

				scene.input.on('pointerdown', () => {
					if (state === 'over') {
						resetGame();
						return;
					}
					if (state !== 'moving' || !movingBox) return;
					state = 'dropping';
					movingBox.state = 'dropping';
				});

				updateUi();
				spawnBox();

				scene.events.on('update', (_, delta) => {
					if (state === 'moving' && movingBox) {
						const minX = 40 + movingBox.width / 2;
						const maxX = scene.scale.width - 40 - movingBox.width / 2;
						movingBox.x += direction * speed * (delta / 1000);
						if (movingBox.x <= minX) {
							movingBox.x = minX;
							direction = 1;
						}
						if (movingBox.x >= maxX) {
							movingBox.x = maxX;
							direction = -1;
						}
						movingBox.rect.setPosition(movingBox.x, movingBox.y);
						movingBox.label.setPosition(movingBox.x, movingBox.y - 8);
					}

					if (state === 'dropping' && movingBox) {
						movingBox.y += dropSpeed * (delta / 1000);
						movingBox.rect.setPosition(movingBox.x, movingBox.y);
						movingBox.label.setPosition(movingBox.x, movingBox.y - 8);
						const top = stack[stack.length - 1] || null;
						const targetY = top
							? top.y - top.height / 2 - movingBox.height / 2
							: groundY() - movingBox.height / 2;

						if (movingBox.y >= targetY) {
							const result = settleBox();
							if (result === false) {
								dropMiss();
								loseLife('miss');
								return;
							}
							if (result === 'collapse') {
								loseLife('collapse');
								return;
							}
							state = 'moving';
							direction *= -1;
							speed = Math.min(240, speed + 6);
							updateUi();
							spawnBox();
						}
					}
				});
			},
		},
	};

	const game = new Phaser.Game(config);

	return {
		game,
		dispose: () => {
			game.destroy(true);
		},
	};
};
