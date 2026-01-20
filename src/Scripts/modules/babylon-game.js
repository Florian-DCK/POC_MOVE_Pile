import {
	Engine,
	Scene,
	ArcRotateCamera,
	Vector3,
	HemisphericLight,
	MeshBuilder,
	Color4,
} from '@babylonjs/core';

export const createBabylonGame = (canvas) => {
	const engine = new Engine(canvas, true, {
		preserveDrawingBuffer: true,
		stencil: true,
	});
	const scene = new Scene(engine);
	scene.clearColor = new Color4(0.06, 0.07, 0.1, 1);

	const camera = new ArcRotateCamera(
		'camera',
		-Math.PI / 2,
		Math.PI / 2.5,
		8,
		new Vector3(0, 1, 0),
		scene,
	);
	camera.attachControl(canvas, true);

	new HemisphericLight('light', new Vector3(0, 1, 0), scene);

	const ground = MeshBuilder.CreateGround(
		'ground',
		{ width: 12, height: 12 },
		scene,
	);
	ground.position.y = 0;

	const sphere = MeshBuilder.CreateSphere('player', { diameter: 1.5 }, scene);
	sphere.position.y = 1;

	engine.runRenderLoop(() => {
		scene.render();
	});

	const handleResize = () => {
		engine.resize();
	};
	window.addEventListener('resize', handleResize);

	return {
		engine,
		scene,
		dispose: () => {
			window.removeEventListener('resize', handleResize);
			scene.dispose();
			engine.dispose();
		},
	};
};
