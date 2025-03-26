import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// Scene, Camera, and Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor( 0xffffff, 0);
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
    // '/xomt.glb',
    `${import.meta.env.BASE_URL}xomt.glb`,
    function (gltf) {
        model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 1, 0);
        scene.add(model);
      //  console.log('Model Loaded:', model);
        // Compute bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());

        // Reposition the model to center
        model.position.sub(center);

        scene.add(model);
        console.log('Model Loaded:', model);
        // Show buttons once the model loads
        document.getElementById('info1').style.display = 'block';
        document.getElementById('info2').style.display = 'block';
        document.getElementById('info3').style.display = 'block';
        document.getElementById('info4').style.display = 'block';
        document.getElementById('info5').style.display = 'block';
    },
    undefined,
    function (error) {
        console.error('Error loading model:', error);
    }
);

// Position the camera
camera.position.set(0, 7, 0);
camera.lookAt(0, 0, 0);

// Convert 3D position to 2D screen position
function updateButtonPositions() {
    if (!model) return;
    const vector = new THREE.Vector3();

    // Button 1 (On/Off Button)
    vector.set(-1.5, 0, 0.8);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x1 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y1 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info1').style.left = `${x1}px`;
    document.getElementById('info1').style.top = `${y1}px`;

    // Button 2 (adjust position as needed)
    vector.set(-1.5, 0, 0.4);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x2 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y2 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info2').style.left = `${x2}px`;
    document.getElementById('info2').style.top = `${y2}px`;

    // Button 3 (SOR-R readers)
    vector.set(0.5, 0, 0.25);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x3 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y3 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info3').style.left = `${x3}px`;
    document.getElementById('info3').style.top = `${y3}px`;

    // Button 4 (adjust position as needed)
    vector.set(-0.9, 0, -0.2);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x4 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y4 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info4').style.left = `${x4}px`;
    document.getElementById('info4').style.top = `${y4}px`;

    // Button 5 (Read Button)
    vector.set(-0.15, 0, 0.4);
    vector.applyMatrix4(model.matrixWorld);
    vector.project(camera);
    const x5 = (vector.x * 0.5 + 0.5) * window.innerWidth;
    const y5 = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
    document.getElementById('info5').style.left = `${x5}px`;
    document.getElementById('info5').style.top = `${y5}px`;
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
    const infoTextRemove = document.getElementById('info-startup');

    infoBox.innerHTML = text;
    infoBox.style.display = 'block';
    infoTextRemove.style.display = 'none';

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
    showInfo("[ON/OFF] Zet de XOM-T aan of uit.");
});
document.getElementById('info2').addEventListener('click', () => {
    showInfo("[ESC] Annuleer uw keuze of ga terug.");
});
document.getElementById('info3').addEventListener('click', () => {
    showInfo("Hier voer je de SOR/T in.");
});
document.getElementById('info4').addEventListener('click', () => {
    showInfo("Voor het selecteren in het hoofdmenu, kunt u gebruik maken van de [F]-knoppen boven aan het toetsenbord. Daarbij kunt u gebruik maken van de [↑]-knop voor de selectie van de overige menu items.");
});
document.getElementById('info5').addEventListener('click', () => {
    showInfo("[ENT] Bevestig uw keuze, selecteer uw selectie of ga verder.");
});

// Progress Bar Setup
let progress = 0;
const totalButtons = 5; // Change this based on the total number of buttons
const progressStep = 100 / totalButtons; // Equal contribution from each button

const progressBar = document.createElement("div");
progressBar.className = "progress-container-bar";
progressBar.style.width = "0%";
progressBar.style.transition = "width 0.3s ease-in-out";

const progressContainer = document.createElement("div");
progressContainer.className = "progress-container";
progressContainer.appendChild(progressBar);

document.body.appendChild(progressContainer);

// Track clicked buttons
const clickedButtons = new Set();
const nextButton = document.getElementById('button-go-next');

// Function to handle button clicks
function increaseProgress(buttonId) {
    if (!clickedButtons.has(buttonId) && progress < 100) {
        clickedButtons.add(buttonId);
        progress += progressStep;
        if (progress > 100) progress = 100; // Ensure it doesn't exceed 100%
        progressBar.style.width = progress + "%";
        if (progress === 100) {
            nextButton.style.display = 'block';
        }
    }
}

// Attach event listeners to buttons
document.getElementById('info1').addEventListener('click', () => increaseProgress('info1'));
document.getElementById('info2').addEventListener('click', () => increaseProgress('info2'));
document.getElementById('info3').addEventListener('click', () => increaseProgress('info3'));
document.getElementById('info4').addEventListener('click', () => increaseProgress('info4'));
document.getElementById('info5').addEventListener('click', () => increaseProgress('info5'));

// Add more buttons dynamically
const buttonIds = ['info1', 'info2', 'info3', 'info4', 'info5']; // Add more button IDs

buttonIds.forEach(id => {
    const button = document.getElementById(id);
    if (button) {
        button.addEventListener('click', () => increaseProgress(id));
    }
});
