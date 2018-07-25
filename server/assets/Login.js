import './Login.css';
import io from 'socket.io-client';

var socket = io('http://localhost:5000/');
socket.on('connected', (data) => {
  console.log(data);
})
