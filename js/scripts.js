var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
var col;
var xmlDOM;
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

	var geometry = new THREE.BoxGeometry(0.5,0.5,0.5);
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
			
			setColour(groupMesh);

			let li = document.createElement('button');
			li.setAttribute("t","t")
			li.className = "colButton";
			li.innerHTML += groupMesh.name;
			li.onclick = function() {
				toggleVisability(li.innerHTML);
				if(li.getAttribute("t") == "f"){
					li.setAttribute("t","t")
					li.style.backgroundColor = "white"
				}
				else{
					li.setAttribute("t","f")
					li.style.backgroundColor = "grey"
				}
			};
			colList.appendChild(li);

			


			
		}

	});

}

//Set Collision Colour
function setColour(Mesh){
	
	switch (Mesh.name){

		case "00100200":
			Mesh.material.transparent = true;
			Mesh.material.opacity = 0.5;
			Mesh.material.color.setRGB(1,0,0);
			break;
		

		default:
			break;
	}
}

//Load Placement
function loadPlacement(PlacementID){
	
	let xmlContent = '';

	fetch("placement/"+PlacementID).then((response)=>{
		response.text().then((xml)=>{
			let parser = new DOMParser();
			xmlDOM = parser.parseFromString(xml, 'application/xml').children[0];
			for(i = 0; i < xmlDOM.childElementCount; i++){
				var Node = xmlDOM.children[i];
				switch (Node.getAttribute("type")){
					
					case "eventbox":

						var geometry = new THREE.BoxGeometry(
							Node.children[1].children[1].innerHTML * 0.001,
							Node.children[1].children[2].innerHTML * 0.001,
							Node.children[1].children[0].innerHTML * 0.001);

						var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
						var cube = new THREE.Mesh( geometry, material );

						cube.position.set(
							Node.children[2].children[0].children[0].children[0].innerHTML * 0.001,
							(Node.children[2].children[0].children[0].children[1].innerHTML * 0.001) + (Node.children[1].children[2].innerHTML * 0.0006),
							Node.children[2].children[0].children[0].children[2].innerHTML * 0.001
						);

						var Rotation = new THREE.Quaternion(
							Node.children[2].children[0].children[1].children[0].innerHTML,
							Node.children[2].children[0].children[1].children[1].innerHTML,
							Node.children[2].children[0].children[1].children[2].innerHTML,
							Node.children[2].children[0].children[1].children[3].innerHTML,
						);

						Rotation.normalize();

						cube.rotation.setFromQuaternion(Rotation);
						
						scene.add( cube );

						break;
					
					default:
						break;
				}
			}
			
		})
	})

}

//Show XML
function showXML(PlacementID){
	var win = window.open("placement/"+PlacementID, '_blank');
	win.focus();
}

//Clear 
function clearScene(){
	scene.children = [];

	//Add Lighting back
	var keyLight = new THREE.DirectionalLight(new THREE.Color("rgb(250,250,250)"), 0.7);
	keyLight.position.set(-100, 0, 100).normalize();
	var fillLight = new THREE.DirectionalLight(new THREE.Color("rgb(204,204,204)"), 0.75);
	fillLight.position.set(100, 1000, 100).normalize();
	var backLight = new THREE.DirectionalLight(0xffffff, 0.5);
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