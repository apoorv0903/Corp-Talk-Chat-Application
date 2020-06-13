const socket =  io('http://localhost:8000');

//Get DOM elements in respective JS variables.
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container")

//Audio that will be played on receiving the message. 
var audio = new Audio('ping-ringtone.mp3');

//function that will append event information to the container.
const append = (message, position)=>{                 // position of message in the container will be 'left' when you receive message from
    // other users and 'right' when you send the message.
    const messageElement = document.createElement('div');  //create a html div element wihtin which the message will be displayed.
    messageElement.innerText = message ;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);    // add message and postion to the messagecontainer.
    if (position == 'left'){
        audio.play();
//Audio will be played when someone else send a message to the chat. Will not be played when you send the message.
    }
}

//ask or prompt new user for name to join the chat and let the server know.
 const name = prompt("Enter your name below- ");
 socket.emit('new-user-joined', name)

//if a new user joins the chat, receive his/her name from the server.
 socket.on('user-joined', name=>{
    append(`${name} joined the chat`, 'right')

 })

 // if server send a message, receive it.
 socket.on('receive', data=>{
    append(`${data.name}: ${data.message}`, 'left')

 })

 //if a user leaves the chat, append the information to the container.
 socket.on('left', name=>{
    append(`${name} left the chat`, 'right')

 })

//if the form gets submitted, send message to the server. 
 form.addEventListener('submit', (e)=>{
    e.preventDefault();                     //prevents reload.
    const message = messageInput.value;     //value of the message provided by the user in the messageInput box.
    append(`You: ${message}`, 'right');   //append the message send by you to the right of the container.
    socket.emit('send', message);           // socket will emit the event to other users with message.
    messageInput.value = ''   // after sending the message empty the messageInput element.

})
