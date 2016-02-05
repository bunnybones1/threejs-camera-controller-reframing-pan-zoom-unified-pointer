function onReady() {
	var View = require('threejs-managed-view').View;
	var ReframingPanZoomController = require('./');
	var MouseWheel = require('input-mousewheel');
	var Pointers = require('input-unified-pointers');
	var gsap = require('gsap');
	var view = new View({
		useRafPolyfill: false
	});
	view.renderer.setClearColor(0xffffaf);

	var scene = view.scene;
	var camera = view.camera;


	camera.position.set(0, 0, 100);

	var sphereGeometry = new THREE.SphereGeometry(1.5);
	var size = 500;
	var sizeHalf = size * 0.5;
	var bounds = new THREE.Box3(
		new THREE.Vector3(-sizeHalf, -sizeHalf, -sizeHalf),
		new THREE.Vector3(sizeHalf, sizeHalf, sizeHalf)
	);
	var random = new THREE.Vector3();
	var boundSize = bounds.size();
	for (var i = 0; i < 1200; i++) {
		var ball = new THREE.Mesh(sphereGeometry);
		scene.add(ball);
		random.set(
			Math.random(),
			Math.random(),
			Math.random()
		);
		ball.position.copy(bounds.min).add(random.multiply(boundSize));
	}

	var margin = 1;

	var targetBoxGeometry = new THREE.BoxGeometry(30, 4, 12, 1, 1, 1);
	var targetBoxMesh = new THREE.Mesh(targetBoxGeometry);
	var targetPoints = targetBoxGeometry.vertices;
	scene.add(targetBoxMesh);

	function panMap(x, y) {
		camera.position.x += x * 0.2;
		camera.position.y += y * -0.2;
	}

	var pointers = new Pointers(view.canvas);
	var mouseWheel = new MouseWheel(view.canvas);
	var controller = new ReframingPanZoomController({
		camera: camera,
		tweener: gsap,
		fovMin: 50,
		fovMax: 60,
		pointers: pointers,
		mouseWheel: mouseWheel,
		targetPoints: targetPoints, 
		size: view.domSize,
		panMap: panMap,
	});

	controller.setState(true);

	// console.warn('NOTE: skipping frames to save battery life while developing while travelling ;). target is 15fps.');
	// view.renderManager.skipFrames = 3;


	view.onResizeSignal.add(controller.setSize);
	size = view.getSize();
	controller.setSize(size.width, size.height);

	view.renderManager.onEnterFrame.add(function() {
		// var time = (new Date()).getTime() * .001 * .25;
		controller.update();
	});
}

var loadAndRunScripts = require('loadandrunscripts');
loadAndRunScripts(
	[
		'bower_components/three.js/three.js'
	],
	onReady
);