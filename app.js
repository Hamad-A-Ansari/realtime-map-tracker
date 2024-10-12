const express = require('express');
const app = express();
const path = require('path');

const socketio = require('socket.io'); //imports socketio
const http = require('http'); //required to run socketio
const server = http.createServer(app);  //creates a server which runs app
const io = socketio(server); //runs the server with socketio

app.set('view engine', 'ejs'); // this is the default view engine for express server (ejs is available in the default config file)
app.use(express.static(path.join(__dirname, 'public'))); //this is the default express static file path 

io.on('connection', function(socket) {
  socket.on("send-location", function(data) {
    io.emit("receive-location", {id: socket.id, ...data}); //this is the connection information 
  });
  socket.on("disconnect", function() {
    io.emit("user-disconnected", socket.id); //this will notify all users about the disconnected user
    console.log('user disconnected');
  });
  console.log('a user connected');
});



app.get('/', function (req, res) {
  res.render('index');
}) //creates a new route

server.listen(3000); //listens on port 3000 or any port specified

