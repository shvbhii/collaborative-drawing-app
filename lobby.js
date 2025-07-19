const joinForm = document.getElementById('join-form');
const roomNameInput = document.getElementById('room-name');

joinForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the form from submitting normally
    const roomName = roomNameInput.value.trim();

    if (roomName) {
        // Redirect the user to the board page with the room name as a query parameter
        window.location.href = `/board.html?room=${roomName}`;
    }
});