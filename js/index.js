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
        }, 500);
    }
});

// Attach event listeners to buttons
document.getElementById('info1').addEventListener('click', () => {
    showInfo("This is Information 1 about the 3D model.");
});
document.getElementById('info2').addEventListener('click', () => {
    console.log('info2 clicked');   
    showInfo("This is Information 2 about another part of the model.");
});