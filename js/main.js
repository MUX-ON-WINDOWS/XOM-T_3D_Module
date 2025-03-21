import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 1); // Soft global light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// GLTF Loader
let model;
const loader = new GLTFLoader();
loader.load(
    '/xomt.glb',
    function (gltf) {
        model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0, 1, 0);
        scene.add(model);
        console.log('Model Loaded:', model);

        // Show buttons once the model loads
        document.getElementById('info1').style.display = 'block';
        document.getElementById('info2').style.display = 'block';
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Position the camera
camera.position.set(0, 2, 5);
camera.lookAt(0, 0, 0);

// Convert 3D position to 2D screen position
function updateButtonPositions() {
    if (!model) return;
    const vector = new THREE.Vector3();

    // Button 1 (adjust position as needed)
    vector.set(0.5, 0, 0);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x1 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y1 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info1').style.left = `${x1}px`;
    document.getElementById('info1').style.top = `${y1}px`;

    // Button 2 (adjust position as needed)
    vector.set(-0.5, 1, 0);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x2 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y2 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info2').style.left = `${x2}px`;
    document.getElementById('info2').style.top = `${y2}px`;
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    updateButtonPositions();
}
animate();


// Text Box Functions and Event Listeners
//--------------------------------------------------------------------------------------------------------------------------------------------------//

// Function to show info in the text box
function showInfo(text) {
    const infoBox = document.getElementById('infoBox');
    infoBox.innerHTML = text;
    infoBox.style.display = 'block';
    setTimeout(() => {
        infoBox.style.opacity = '1';
    }, 50);
}

// Hide the text box when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.classList.contains('info-button')) {
        const infoBox = document.getElementById('infoBox');
        infoBox.style.opacity = '0';
        setTimeout(() => {
            infoBox.style.display = 'none';
        }, 10000);
    }
});

// Attach event listeners to buttons
document.getElementById('info1').addEventListener('click', () => {
    showInfo("This is Information 1 about the 3D model.");
});
document.getElementById('info2').addEventListener('click', () => {
    showInfo("This is Information 2 about another part of the model.");
});

// Progress Bar Setup
let progress = 0;
const totalButtons = 10; // Change this based on the total number of buttons
const progressStep = 100 / totalButtons; // Equal contribution from each button

const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "20px";
progressBar.style.background = "green";
progressBar.style.borderRadius = "10px";
progressBar.style.transition = "width 0.3s ease-in-out";

const progressContainer = document.createElement("div");
progressContainer.style.width = "100%";
progressContainer.style.maxWidth = "300px";
progressContainer.style.background = "#ccc";
progressContainer.style.borderRadius = "10px";
progressContainer.style.marginTop = "20px";
progressContainer.className = "progress-container";
progressContainer.appendChild(progressBar);

document.body.appendChild(progressContainer);

// Track clicked buttons
const clickedButtons = new Set(); 

// Function to handle button clicks
function increaseProgress(buttonId) {
    if (!clickedButtons.has(buttonId) && progress < 100) {
        clickedButtons.add(buttonId);
        progress += progressStep;
        if (progress > 100) progress = 100; // Ensure it doesn't exceed 100%
        progressBar.style.width = progress + "%";
    }
}

// Attach event listeners to buttons
document.getElementById('info1').addEventListener('click', () => increaseProgress('info1'));
document.getElementById('info2').addEventListener('click', () => increaseProgress('info2'));

// Add more buttons dynamically
const buttonIds = ['info1', 'info2', 'info3', 'info4', 'info5']; // Add more button IDs

buttonIds.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', () => increaseProgress(id));
    }
});
