const socket = io();

const messageFrom = document.querySelector('.chat-center form');
const messageInput = document.getElementById('send-msg');
const messageHistory = document.querySelector('.chat-history');
const onlineUsers = document.querySelector('.online-users');

const userName = prompt('Your name please !');

// Define the functions
const appendMessage = (msgData) => {
    let msgDiv = document.createElement('div');
    msgDiv.innerHTML = msgData;
    messageHistory.appendChild(msgDiv);
}
const appendMessageToOnlineUserList = (msgData) => {
    let msgDiv = document.createElement('div');
    msgDiv.innerHTML = msgData;
    onlineUsers.appendChild(msgDiv);
}

// Call the function
appendMessage('You Joined');

// Msg receiving by on method of socket
socket.on('send-message-to-others' , (user) => {
    appendMessage(`<b>${user.userName}</b>: ${user.message}`);
});
socket.on('user-connected' , (userName) => {
    appendMessage(`<b>${userName}</b> is joined`);
});
socket.on('user-disconnected' , (userName) => {
    appendMessage(`<b>${userName}</b> is disconnected`);
});
socket.on('get-online-users' , (userList) => {
    console.log('userList',userList);
    for(let i = 0; i < userList.length; i++){
        appendMessageToOnlineUserList(userList[i]);
    }
});

// Msg sending by emit method of socket
socket.emit('new-user-connection', userName);

messageFrom.addEventListener('submit', event => {
    event.preventDefault();
    appendMessage(`You: ${messageInput.value}`)
    socket.emit('send-chat-message', messageInput.value);
    messageInput.value = '';
})