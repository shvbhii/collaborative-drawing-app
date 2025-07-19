
const urlParams = new URLSearchParams(window.location.search);
const roomName = urlParams.get('room');

if (!roomName) {
    window.location.href = '/index.html';
}

const socket = io();
socket.on('connect', () => {
    socket.emit('join-room', roomName);
});


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


let isDrawing = false;
let lastX = 0;
let lastY = 0;
let isErasing = false;
const userCursors = {};
let history = [];
let historyIndex = -1;




const LOGICAL_WIDTH = 1920;
const LOGICAL_HEIGHT = 1080;


canvas.width = LOGICAL_WIDTH;
canvas.height = LOGICAL_HEIGHT;



function getCoordinates(event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;

    if (event.touches && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else {
        clientX = event.clientX;
        clientY = event.clientY;
    }

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}


function startDrawing(event) {
    isDrawing = true;
    const coords = getCoordinates(event);
    lastX = coords.x;
    lastY = coords.y;
}

function handleDrawing(event) {
    event.preventDefault();
    if (!isDrawing) return;
    
    const coords = getCoordinates(event);
    const drawColor = isErasing ? '#FFFFFF' : colorPicker.value;
    const data = { lastX, lastY, newX: coords.x, newY: coords.y, color: drawColor, size: brushSize.value };
    
    drawOnCanvas(data);
    socket.emit('drawing', data);
    
    lastX = coords.x;
    lastY = coords.y;
}

function stopDrawing() {
    if (isDrawing) saveState();
    isDrawing = false;
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


canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('touchstart', startDrawing);

canvas.addEventListener('mousemove', handleDrawing);
canvas.addEventListener('touchmove', handleDrawing);

canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);


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
    link.download = `${roomName}-drawing-by-Shubhi.png`;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.font = '14px Poppins';
    tempCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    tempCtx.textAlign = 'right';
    tempCtx.fillText('- by Shubhi Sharma -', tempCanvas.width - 15, tempCanvas.height - 15);
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
});


function updateBrushPreview() {
    const size = brushSize.value;
    brushPreview.style.width = `${size}px`;
    brushPreview.style.height = `${size}px`;
    brushPreview.style.backgroundColor = isErasing ? '#FFFFFF' : colorPicker.value;
    brushPreview.style.border = isErasing ? '1px solid #ccc' : 'none';
}


socket.on('drawing', (data) => drawOnCanvas(data));
socket.on('clear', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveState();
});

socket.on('cursor-move', (data) => {
    
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


window.addEventListener('load', () => {
    colorPicker.classList.add('active');
    updateBrushPreview();
    saveState();
});