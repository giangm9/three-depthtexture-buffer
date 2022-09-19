import { EffectComposer } from "@three-addons/postprocessing/EffectComposer.js";
import { RenderPass } from "@three-addons/postprocessing/RenderPass.js";
import { AmbientLight, DepthTexture, HemisphereLight, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, SphereGeometry, TextureLoader, UnsignedShortType, WebGLRenderer, WebGLRenderTarget } from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { ClearPass } from "@three-addons/postprocessing/ClearPass.js"
import { V1Shader } from "V1Shader";

import { GLTFLoader } from "@three-addons/loaders/GLTFLoader.js"

const texLoader = new TextureLoader();
const canvas = document.createElement('canvas');
const width = 1128; //canvas.offsetWidth
const height = 768; //canvas.offsetHeight
const scene = new Scene();
const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
const camera = new PerspectiveCamera(50.7, width / height, 2, 10);
const tBackground = texLoader.load('color2.jpg');
const tDepth = texLoader.load('depth2.jpg');
const target = new WebGLRenderTarget(width, height);
const v1pass = new ShaderPass(V1Shader)
const gltfLoader = new GLTFLoader()


const ui = new Scene();

const uiCanvas = document.createElement('canvas');
const uiRenderer = new WebGLRenderer({ canvas: uiCanvas, antialias: true, alpha: true });

scene.add(new AmbientLight(8.))
scene.add(new HemisphereLight(0xffffff, 0xffffff, 3.))


target.depthTexture = new DepthTexture(width, height,
    UnsignedShortType
);

document.body.append(renderer.domElement);
document.body.append(uiCanvas)
uiCanvas.style.position = 'fixed';
uiCanvas.style.left = '0';
uiCanvas.style.top = '0';


uiRenderer.setSize(width, height, true)
renderer.setSize(width, height, false);
camera.position.z = 10;
// camera.position.set(
//     1.38525,
//     1.69283,
//     10.4643,

// )
camera.lookAt(0, 0, 0);

renderer.setRenderTarget(target);
renderer.autoClear = true;


const renderPass = new RenderPass(scene, camera);

renderPass.clear = false;
// ui.clear = false;

const composer = new EffectComposer(renderer);
composer.addPass(new ClearPass());
composer.addPass(renderPass);
composer.addPass(v1pass);
v1pass.uniforms['tBackground'].value = tBackground;
v1pass.uniforms['tSceneDepth'].value = target.depthTexture;
v1pass.uniforms['tDepth'].value = tDepth;


function update() {
    requestAnimationFrame(update);
    renderer.render(scene, camera);
    composer.render();
    uiRenderer.render(ui, camera);
    // if (control?.object)
    //     console.log(control.object.position);


}

requestAnimationFrame(update);
const control = new TransformControls(camera, uiCanvas)
setupScene();



function setupScene() {

    gltfLoader.load('/leather_chair.glb', gltf => {

        const obj = gltf.scene;
        scene.add(obj);
        control.attach(obj)
        obj.scale.set(0.2, 0.2, 0.2);
        obj.position.set(1.013412608396054, -0.4444789812236794, 7.693745065246518);

        window['focusChair'] = () => {
            control.attach(obj)
        }
    });



    gltfLoader.load('/arm_chair__furniture.glb', gltf => {

        const obj = gltf.scene;
        scene.add(obj);
        control.attach(obj)
        obj.scale.set(0.3, 0.3, 0.3);
        obj.position.set(1.0420114210350266, -0.6696484726972347, 7.548876819222012);
        window['focusArmChair'] = () => {
            control.attach(obj)
        }
    });



    ui.add(control)
    // scene.add(control)
    control.setSpace('world')
    document.addEventListener('keypress', (event) => {
        if (event.key == 'q') { control.setMode('translate') }
        if (event.key == 'w') { control.setMode('rotate') }
        if (event.key == 'e') { control.setMode('scale') }
    })

}
