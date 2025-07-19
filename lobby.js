const joinForm = document.getElementById('join-form');
const roomNameInput = document.getElementById('room-name');
const userNameInput = document.getElementById('user-name');

joinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const roomName = roomNameInput.value.trim();
    const userName = userNameInput.value.trim();

    if (roomName && userName) {
        
        const url = `/board.html?room=${encodeURIComponent(roomName)}&name=${encodeURIComponent(userName)}`;
        window.location.href = url;
    }
});