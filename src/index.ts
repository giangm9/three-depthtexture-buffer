import {Scene, WebGLRenderer, PerspectiveCamera, Mesh, MeshBasicMaterial, BoxGeometry} from "three";


const canvas = document.createElement('canvas');
document.body.append(canvas);
canvas.style.width = '100%';
canvas.style.height = '100%';


const scene = new Scene();
const renderer = new WebGLRenderer({canvas, antialias : true});
const camera = new PerspectiveCamera(75, canvas.offsetWidth /  canvas.offsetHeight, 0.001, 100);

renderer.setSize(canvas.offsetWidth, canvas.offsetHeight, false);

camera.position.z = 5;
camera.lookAt(0,0,0);

const cube = new Mesh(
    new BoxGeometry(1., 1., 1.),
    new MeshBasicMaterial({color: 'blue'})
)

scene.add(cube);

requestAnimationFrame(update);


function update() {
    requestAnimationFrame(update);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}