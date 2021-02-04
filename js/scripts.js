var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/1.25, window.innerHeight/1.25 );
document.body.appendChild( renderer.domElement );

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

var speed = 1;

var controls = new THREE.PointerLockControls(camera, renderer.domElement); 
var clock = new THREE.Clock();
renderer.domElement.addEventListener('click', function(){
	controls.lock();
},false);

var keyboard = [];
addEventListener('keydown', (e) =>{
	keyboard[e.key] = true;
});
addEventListener('keyup', (e) =>{
	keyboard[e.key] = false;
});
addEventListener('wheel', (e) => {
	console.log("a")
	if(e.deltaY  > 0){
		speed *= 0.90;
	}
	else if(e.deltaY  < 0){
		speed *= 10/9;
	}
  });

function processKeys(){
	if (keyboard['w']){
		controls.moveForward(speed)
	}

	if (keyboard['s']){
		controls.moveForward(-speed)
	}

	if (keyboard['d']){
		controls.moveRight(speed)
	}

	if (keyboard['a']){
		controls.moveRight(-speed)
	}
}


var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100).normalize();

var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 1000, 100).normalize();

var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();



scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);

function loadScene(){

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	var objLoader = new THREE.OBJLoader();
	
	objLoader.load('Resources/collision.obj', function(object){
		object.scale.set(0.001,0.001,0.001)
		object.position.set(0,0,0);
		scene.add(object);
	});
}

function clearScene(){
	scene.children = [];
	var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
	keyLight.position.set(-100, 0, 100).normalize();

	var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
	fillLight.position.set(100, 1000, 100).normalize();

	var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
	backLight.position.set(100, 0, -100).normalize();

	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
}


var animate = function () {
	requestAnimationFrame( animate );
	processKeys();

	renderer.render(scene, camera);
};

animate();