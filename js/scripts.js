var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var col;
var collisionGroups;
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth/1.25, window.innerHeight/1.25 );
document.getElementById("CV").appendChild( renderer.domElement );

camera.position.z = 5;


//Camera Controls
var speed = 1;
var controls = new THREE.PointerLockControls(camera, renderer.domElement); 
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


//Load Collision
function loadScene(LevelID){

	clearScene();

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );

	var objLoader = new THREE.OBJLoader();
	
	collisionGroups = [];

	objLoader.load('stage/' + LevelID + "/collision.obj", function(object){
		object.scale.set(0.001,0.001,0.001)
		object.position.set(0,0,0);
		col = object; 
		scene.add(object);

		var colList = document.getElementById("collisionList");
		colList.innerHTML = '';

		for (i = 0; i < col.children.length; i++){
			
			var groupMesh  = col.children[i]; 
			collisionGroups.push(groupMesh);
			
			let li = document.createElement('button');
			li.className = "colButton";
			li.addEventListener('click', toggleVisability(groupMesh.name));
			colList.appendChild(li);

			

			li.innerHTML += groupMesh.name;

			
		}

	});

}


//Clear Collision
function clearScene(){
	scene.children = [];

	//Add Lighting back
	var keyLight = new THREE.DirectionalLight(new THREE.Color("rgb(250,250,250)"), 1.0);
	keyLight.position.set(-100, 0, 100).normalize();
	var fillLight = new THREE.DirectionalLight(new THREE.Color("rgb(250,250,250)"), 0.75);
	fillLight.position.set(100, 1000, 100).normalize();
	var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
	backLight.position.set(100, 0, -100).normalize();
	scene.add(keyLight);
	scene.add(fillLight);
	scene.add(backLight);
}

//Toggle Mesh Visability
function toggleVisability(MeshName){
	for(i = 0; i < collisionGroups.length; i++){
		if(MeshName == collisionGroups[i].name){
			collisionGroups[i].visible = !collisionGroups[i].visible;
		}
	}
}

clearScene()

var animate = function () {
	requestAnimationFrame( animate );
	processKeys();

	renderer.render(scene, camera);
};
animate();