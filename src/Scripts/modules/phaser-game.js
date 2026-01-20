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
