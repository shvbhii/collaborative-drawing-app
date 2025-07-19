


const socket = io();


const canvas = document.getElementById('drawing-board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearButton = document.getElementById('clearButton');


canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.7;


let isDrawing = false;
let lastX = 0;
let lastY = 0;


function draw(e) {
    if (!isDrawing) return; 

    const data = {
        lastX: lastX,
        lastY: lastY,
        newX: e.offsetX,
        newY: e.offsetY,
        color: colorPicker.value,
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