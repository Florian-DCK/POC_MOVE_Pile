import Phaser from 'phaser';

export const createPhaserGame = (canvas) => {
	const parent = canvas.parentElement;
	let rootScene = null;

	class GameObjectController {
		constructor(scene, textureKey, x, y) {
			this.scene = scene;
			this.sprite = scene.add.sprite(x, y, textureKey);
			this.isDragging = false;
			this.didDrag = false;
			this.init();
		}

		init() {
			this.sprite.setInteractive({ draggable: true });
			this.sprite.on('pointerdown', () => {
				this.didDrag = false;
			});
			this.sprite.on('dragstart', () => {
				this.isDragging = true;
				this.didDrag = true;
				this.sprite.setScale(1.2);
			});
			this.sprite.on('drag', (pointer, dragX, dragY) => {
				this.didDrag = true;
				this.sprite.setPosition(dragX, dragY);
			});
			this.sprite.on('dragend', () => {
				this.sprite.setScale(1);
				this.isDragging = false;
			});
			this.sprite.on('pointerup', () => {
				if (!this.didDrag) {
					this.sprite.angle += 90;
				}
				this.didDrag = false;
			});
		}
	}

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
			preload() {
				this.load.image('saw', './Content/img/game/assets/saw.png');
				this.load.image('hammer', './Content/img/game/assets/hammer.png');
			},
			create() {
				rootScene = this;
				this.input.dragDistanceThreshold = 8;
				this.cameras.main.setBackgroundColor('#6e7297');
				const { width, height } = this.scale;
				const storageWidth = Math.floor(width * 0.28);
				const storageX = width - storageWidth - 24;
				const storageY = 24;
				const storageH = height - 48;
				const storageGfx = this.add.graphics();
				storageGfx.lineStyle(3, 0xffffff, 0.6);
				storageGfx.strokeRect(storageX, storageY, storageWidth, storageH);
				storageGfx.lineStyle(2, 0xffffff, 0.35);
				storageGfx.beginPath();
				storageGfx.moveTo(storageX, storageY + storageH * 0.33);
				storageGfx.lineTo(storageX + storageWidth, storageY + storageH * 0.33);
				storageGfx.moveTo(storageX, storageY + storageH * 0.66);
				storageGfx.lineTo(storageX + storageWidth, storageY + storageH * 0.66);
				storageGfx.strokePath();
				storageGfx.fillStyle(0xffffff, 0.9);
				const snapPoints = [
					{ x: storageX + storageWidth * 0.3, y: storageY + storageH * 0.2 },
					{ x: storageX + storageWidth * 0.7, y: storageY + storageH * 0.2 },
					{ x: storageX + storageWidth * 0.3, y: storageY + storageH * 0.5 },
					{ x: storageX + storageWidth * 0.7, y: storageY + storageH * 0.5 },
					{ x: storageX + storageWidth * 0.3, y: storageY + storageH * 0.8 },
					{ x: storageX + storageWidth * 0.7, y: storageY + storageH * 0.8 },
				];
				snapPoints.forEach((point) => {
					storageGfx.fillCircle(point.x, point.y, 5);
				});
				const saw = new GameObjectController(this, 'saw', 400, 300);
				const hammer = new GameObjectController(this, 'hammer', 200, 150);
			},
		},
	};

	const game = new Phaser.Game(config);

	return {
		game,
		getScene: () => rootScene,
		dispose: () => {
			game.destroy(true);
		},
	};
};
