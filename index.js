
var PanZoomController = require('threejs-camera-controller-pan-zoom-unified-pointer');
var MultitargetFramer = require('threejs-camera-controller-multitarget-framing');
function Controller(opts) {
	opts = opts || {};
	var camera = opts.camera;
	var panZoomController = new PanZoomController({
		camera: opts.camera,
		tweener: opts.tweener,
		fovMin: opts.fovMin || 30,
		fovMax: opts.fovMax || 60,
		zoomMax: opts.zoomMax || 0.3,
		pointers: opts.pointers,
		mouseWheel: opts.mouseWheel,
		panMap: opts.panMap,
		autoSetCamera: false
	});
	var intermediateCamera = camera.clone();
	opts.camera.parent.add(intermediateCamera);
	var framingController = new MultitargetFramer(
		intermediateCamera,
		opts.targetPoints, 
		opts.size
	);

	function update(omitReframe) {
		intermediateCamera.position.copy(camera.position);
		intermediateCamera.rotation.copy(camera.rotation);
		// intermediateCamera.fov = camera.fov;
		// framingController.frameMargin.set(0, 0);
		var deltaScore = 0;
		if (!omitReframe) {
			deltaScore = framingController.update();
		}
		camera.rotation.copy(intermediateCamera.rotation);
		panZoomController.precomposeViewport(intermediateCamera);
		//this metric helps you decide whether things have changed or not. helps in deciding whether its worth a rerender or not.
		// console.log(deltaScore);
		return deltaScore;
	}

	function setSize(w, h) {
		panZoomController.setSize(w, h);
		framingController.updateSize(w, h);
	}

	function setState(state) {
		panZoomController.setState(state);
	}

	function reset(animate) {
		panZoomController.reset(animate);
		if(!animate) panZoomController.precomposeViewport(intermediateCamera);
	}

	this.update = update;
	this.setSize = setSize;
	this.zoomSignal = panZoomController.zoomSignal;
	this.panSignal = panZoomController.panSignal;
	this.framingController = framingController;
	this.panZoomController = panZoomController;
	this.setState = setState;
	this.onPointerDown = panZoomController.onPointerDown;
	this.reset = reset;
	this.isPanning = panZoomController.isPanning;
}

module.exports = Controller;
