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
const tBackground = texLoader.load('color.jpg');
const tDepth = texLoader.load('depth.jpg');
const target = new WebGLRenderTarget(width, height);
const v1pass = new ShaderPass(V1Shader)
const gltfLoader = new GLTFLoader()


const ui = new Scene();
renderer.autoClear = false;

scene.add(new AmbientLight(8.))
scene.add(new HemisphereLight())


target.depthTexture = new DepthTexture(width, height,
    UnsignedShortType
);
document.body.append(renderer.domElement);

renderer.setSize(width, height, false);
camera.position.z = 5;
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
}

requestAnimationFrame(update);

setupScene();


function setupScene() {
    const control = new TransformControls(camera, canvas)
    gltfLoader.load('/arm_chair__furniture.glb', gltf => {
        const obj = gltf.scene;
        scene.add(obj);
        control.attach(obj)

    });
    // ui.add(control)
    scene.add(control)
    control.setSpace('world')
    document.addEventListener('keypress', (event) => {
        if (event.key == 'q') { control.setMode('translate') }
        if (event.key == 'w') { control.setMode('rotate') }
        if (event.key == 'e') { control.setMode('scale') }
    })

}
