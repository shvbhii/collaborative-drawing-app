const socket = io();

// Object to store cursor elements for each user
const userCursors = {};

// Get references to all HTML elements
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const eraserButton = document.getElementById('eraserButton');
const brushPreview = document.getElementById('brushPreview');
const saveButton = document.getElementById('saveButton');
const cursorsContainer = document.getElementById('cursors-container');
const userList = document.getElementById('user-list');
const userCount = document.getElementById('user-count');

// Set canvas dimensions
canvas.width = window.innerWidth * 0.7; // Adjusted width for sidebar
canvas.height = window.innerHeight * 0.7;

// Variables to store drawing state
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;

function draw(e) {
    if (!isDrawing) return;

    const drawColor = isErasing ? '#FFFFFF' : colorPicker.value;

    const data = {
        lastX: lastX,
        lastY: lastY,
        newX: e.offsetX,
        newY: e.offsetY,
        color: drawColor,
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

// Event Listeners for Drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mousemove', (e) => {
    socket.emit('cursor-move', { x: e.offsetX, y: e.offsetY });
    draw(e);
});

canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

// Event Listeners for Tools
eraserButton.addEventListener('click', () => {
    isErasing = true;
    eraserButton.classList.add('active');
    colorPicker.classList.remove('active');
    updateBrushPreview();
});

colorPicker.addEventListener('click', () => {
    isErasing = false;
    eraserButton.classList.remove('active');
    colorPicker.classList.add('active');
});

colorPicker.addEventListener('input', () => {
    updateBrushPreview();
});

brushSize.addEventListener('input', updateBrushPreview);

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('clear');
});

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

// Socket Listeners for Collaboration
socket.on('drawing', (data) => {
    drawOnCanvas(data);
});

socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

socket.on('cursor-move', (data) => {
    if (!userCursors[data.id]) {
        const cursor = document.createElement('div');
        cursor.className = 'cursor';
        cursor.style.backgroundColor = `hsl(${Math.random() * 360}, 90%, 50%)`;
        cursorsContainer.appendChild(cursor);
        userCursors[data.id] = cursor;
    }
    userCursors[data.id].style.left = `${data.x}px`;
    userCursors[data.id].style.top = `${data.y}px`;
});

socket.on('user-disconnected', (id) => {
    if (userCursors[id]) {
        userCursors[id].remove();
        delete userCursors[id];
    }
});

socket.on('update-user-list', (users) => {
    userList.innerHTML = '';
    userCount.textContent = users.length;
    users.forEach(user => {
        const li = document.createElement('li');
        if (user.id === socket.id) {
            li.textContent = `User ${user.id.substring(0, 4)} (You)`;
            li.style.fontWeight = 'bold';
        } else {
            li.textContent = `User ${user.id.substring(0, 4)}`;
        }
        userList.appendChild(li);
    });
});

// Initial Setup on Load
window.addEventListener('load', () => {
    colorPicker.classList.add('active');
    updateBrushPreview();
});