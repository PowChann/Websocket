const socket = io();

// State
let myUsername = '';
let myColor = '';
let hasJoined = false;
const activeCursors = new Map(); // username -> DOM element

// Elements
const loginModal = document.getElementById('login-modal');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const cursorArea = document.getElementById('cursor-area');
const usersGrid = document.getElementById('users-grid');
const onlineCount = document.getElementById('online-count');
const myAvatar = document.getElementById('my-avatar');
const myUsernameDisplay = document.getElementById('my-username');
const myProfile = document.getElementById('my-profile');
const messagesBox = document.getElementById('messages');
const chatForm = document.getElementById('chat-form');
const msgInput = document.getElementById('message-input');

// --- Helper Functions ---

function createAvatar(username, color) {
    const div = document.createElement('div');
    div.className = 'avatar';
    div.style.backgroundColor = color;
    div.textContent = username.substring(0, 2).toUpperCase();
    div.title = username;
    return div;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function isOwn(name) {
    return name === myUsername;
}

// Visuals for Cursor
function updateCursorVisuals(username, color, x, y) {
    let el = activeCursors.get(username);
    if (!el) {
        // Create new cursor element
        el = document.createElement('div');
        el.className = 'cursor';
        el.style.color = color; // Used for currentColor

        // SVG Arrow Icon
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "cursor-icon");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "currentColor");

        // Arrow Path
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M3.2 2.4L20.8 12L12 13.6L9.6 22.4L3.2 2.4Z");
        svg.appendChild(path);

        const label = document.createElement('div');
        label.className = 'cursor-label';
        label.textContent = username;

        el.appendChild(svg);
        el.appendChild(label);

        cursorArea.appendChild(el);
        activeCursors.set(username, el);
    }

    // Update position based on relative coordinates
    el.style.transform = `translate(${x * window.innerWidth}px, ${y * window.innerHeight}px)`;
}

// Event Listeners 
// 1. Join Lobby
function joinLobby() {
    const name = usernameInput.value.trim() || 'User' + Math.floor(Math.random() * 1000);
    myUsername = name;
    socket.emit('join-lobby', { username: name });
    loginModal.classList.add('hidden');
    hasJoined = true;
}

joinBtn.addEventListener('click', joinLobby);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinLobby();
});

// 2. Cursor Logic
cursorArea.addEventListener('mousemove', (e) => {
    if (!hasJoined) return;
    const rect = cursorArea.getBoundingClientRect();

    // Calculate relative position (0.0 to 1.0)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Emit to server
    socket.emit('cursor-move', { x, y });

    // Show own cursor locally for smoothness
    updateCursorVisuals(myUsername, myColor || '#fff', x, y);
});

// 3. Chat Logic
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = msgInput.value.trim();
    if (text && hasJoined) {
        socket.emit('chat-message', { message: text });
        msgInput.value = '';
    }
});


// My Color Assigned
socket.on('your-color', (data) => {
    myColor = data.color;
    myProfile.style.display = 'flex';
    myUsernameDisplay.textContent = myUsername;
    myAvatar.style.backgroundColor = myColor;
    myAvatar.textContent = myUsername.substring(0, 2).toUpperCase();
});

// User List Update
socket.on('users-update', (users) => {
    onlineCount.textContent = users.length;
    usersGrid.innerHTML = '';

    const currentOnline = new Set();

    users.forEach(user => {
        currentOnline.add(user.username);
        if (user.username !== myUsername) {
            const avatar = createAvatar(user.username, user.color);
            usersGrid.appendChild(avatar);
        }
    });

    // Cleanup disconnected cursors
    activeCursors.forEach((el, username) => {
        if (!currentOnline.has(username)) {
            el.remove();
            activeCursors.delete(username);
        }
    });
});

// Receive Cursor Updates
socket.on('cursor-update', (data) => {
    if (data.username === myUsername) return; // Ignore own echo
    updateCursorVisuals(data.username, data.color, data.x, data.y);
});

// Remove Cursor
socket.on('cursor-remove', (data) => {
    const el = activeCursors.get(data.username);
    if (el) {
        el.remove();
        activeCursors.delete(data.username);
    }
});

// Receive Chat Message
socket.on('chat-message', (data) => {
    const li = document.createElement('li');
    // Styling
    li.className = isOwn(data.username) ? 'message-item own-message' : 'message-item other-message';

    // Use color from server or default
    const color = data.color || '#333';

    li.innerHTML = `
    <div class="message-header" style="color: ${color}">${data.username}</div>
    <div>${escapeHtml(data.message)}</div>
  `;
    messagesBox.appendChild(li);
    messagesBox.scrollTop = messagesBox.scrollHeight;
});
