// --- START OF CORRECTED script.js ---

const socket = io();


const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const eraserButton = document.getElementById('eraserButton');
const brushPreview = document.getElementById('brushPreview');
const saveButton = document.getElementById('saveButton');


canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;


let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;


// --- THIS IS THE CORRECTED FUNCTION ---
function draw(e) {
    if (!isDrawing) return; 

    // ADD THIS LINE: This checks if we are erasing. If so, it sets the color to white.
    // If not, it uses the color from the color picker. This defines 'drawColor'.
    const drawColor = isErasing ? '#FFFFFF' : colorPicker.value;

    const data = {
        lastX: lastX,
        lastY: lastY,
        newX: e.offsetX,
        newY: e.offsetY,
        color: drawColor, // Now this line works perfectly!
        size: brushSize.value
    };

    
    drawOnCanvas(data);
    socket.emit('drawing', data);
    [lastX, lastY] = [e.offsetX, e.offsetY];
}


function drawOnCanvas(data) {
    ctx.beginPath();
    ctx.moveTo(data.lastX, data.lastY);
    ctx.lineTo(data.newX, data.newY);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = data.size;
    ctx.lineCap = 'round'; 
    ctx.stroke();
}

function updateBrushPreview() {
    const size = brushSize.value;
    const color = colorPicker.value;

    brushPreview.style.width = `${size}px`;
    brushPreview.style.height = `${size}px`;
    
    brushPreview.style.backgroundColor = isErasing ? '#FFFFFF' : color;
    brushPreview.style.border = isErasing ? '1px solid #ccc' : 'none';
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false); 


socket.on('drawing', (data) => {
    drawOnCanvas(data);
});


clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
});


socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

eraserButton.addEventListener('click', () => {
    isErasing = true;
    
    // Update the visual active state
    eraserButton.classList.add('active');
    colorPicker.classList.remove('active');
    
    // Update the preview to show a white circle
    updateBrushPreview();
});

// When the Color Picker swatch is CLICKED, immediately turn off erasing mode.
colorPicker.addEventListener('click', () => {
    isErasing = false;

    // Update the visual active state
    eraserButton.classList.remove('active');
    colorPicker.classList.add('active');
});

// When the color value is CHANGED (live), update the brush preview.
colorPicker.addEventListener('input', () => {
    // We don't need to set isErasing here because the 'click' event already handled it.
    // We just need to update the color of the preview.
    updateBrushPreview();
});

brushSize.addEventListener('input', updateBrushPreview);

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);

    link.href = tempCanvas.toDataURL('image/png');
    link.click();
});


window.addEventListener('load', () => {
    colorPicker.classList.add('active'); 
    updateBrushPreview();
});