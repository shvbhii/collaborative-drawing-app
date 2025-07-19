// --- Initial Setup: Room and Socket Connection ---
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room');

if (!roomName) {
    window.location.href = '/index.html';
}

const socket = io();
socket.on('connect', () => {
    socket.emit('join-room', roomName);
});

// --- Element References ---
const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');
const eraserButton = document.getElementById('eraserButton');
const brushPreview = document.getElementById('brushPreview');
const saveButton = document.getElementById('saveButton');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const cursorsContainer = document.getElementById('cursors-container');
const userList = document.getElementById('user-list');
const userCount = document.getElementById('user-count');

// --- State Variables ---
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;
const userCursors = {};
let history = [];
let historyIndex = -1;

// --- Canvas & Drawing Functions ---
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.8;

function draw(e) {
    if (!isDrawing) return;
    const drawColor = isErasing ? '#FFFFFF' : colorPicker.value;
    const data = { lastX, lastY, newX: e.offsetX, newY: e.offsetY, color: drawColor, size: brushSize.value };
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

// --- Undo/Redo Logic ---
function saveState() {
    if (historyIndex < history.length - 1) history.splice(historyIndex + 1);
    const canvasData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    history.push(canvasData);
    historyIndex = history.length - 1;
    updateUndoRedoButtons();
}

function redrawCanvas(index) {
    if (index < 0 || index >= history.length) return;
    ctx.putImageData(history[index], 0, 0);
}

function updateUndoRedoButtons() {
    undoButton.disabled = historyIndex <= 0;
    redoButton.disabled = historyIndex >= history.length - 1;
}

// --- Event Listeners ---
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});
canvas.addEventListener('mousemove', (e) => {
    socket.emit('cursor-move', { x: e.offsetX, y: e.offsetY });
    draw(e);
});
canvas.addEventListener('mouseup', () => {
    if (isDrawing) saveState();
    isDrawing = false;
});
canvas.addEventListener('mouseout', () => isDrawing = false);

// Tool Listeners
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
colorPicker.addEventListener('input', updateBrushPreview);
brushSize.addEventListener('input', updateBrushPreview);

undoButton.addEventListener('click', () => {
    if (historyIndex > 0) {
        historyIndex--;
        redrawCanvas(historyIndex);
        updateUndoRedoButtons();
    }
});
redoButton.addEventListener('click', () => {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        redrawCanvas(historyIndex);
        updateUndoRedoButtons();
    }
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
    socket.emit('clear');
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `${roomName}-drawing.png`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
});

// --- UI Update Functions ---
function updateBrushPreview() {
    const size = brushSize.value;
    brushPreview.style.width = `${size}px`;
    brushPreview.style.height = `${size}px`;
    brushPreview.style.backgroundColor = isErasing ? '#FFFFFF' : colorPicker.value;
    brushPreview.style.border = isErasing ? '1px solid #ccc' : 'none';
}

// --- Socket Event Handlers ---
socket.on('drawing', (data) => drawOnCanvas(data));
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
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
        const selfLabel = user.id === socket.id ? ' (You)' : '';
        li.textContent = `User ${user.id.substring(0, 4)}${selfLabel}`;
        if (selfLabel) li.style.fontWeight = 'bold';
        userList.appendChild(li);
    });
});

// --- Initial Page Load Setup ---
window.addEventListener('load', () => {
    colorPicker.classList.add('active');
    updateBrushPreview();
    saveState(); // Save the initial blank state
});