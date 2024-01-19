// const socket = io('https://localhost:8000');
const socket = io('http://localhost:8000');


//GET DOM elements in respective Js Variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container")

//Audio that will play on receiving messages
var audio = new Audio('ting.mp3');


//Function which will append event info to the container 
const append = (message, position) => {
    const messageElement = document.createElement('div')
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if (position == 'left') {
        audio.play();
    }
}

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join the Chat");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name => {
    append(`${name} Joined the Chat`, 'right')
})

//if server sends a message, receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left')
})

//If a user leaves the chat, append the info to the container
socket.on('left', name => {
    append(`${name}: Left the Chat `, 'right')
})

//If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You :${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
})