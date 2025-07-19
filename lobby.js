const joinForm = document.getElementById('join-form');
const roomNameInput = document.getElementById('room-name');

joinForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    const roomName = roomNameInput.value.trim();

    if (roomName) {
        
        
        window.location.href = `/board.html?room=${encodeURIComponent(roomName)}`;
    }
});