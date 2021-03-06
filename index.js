const express = require('express')
const app = express();
const server = require('http').Server(app)
const socket = require("socket.io")
const io = socket(server)

const users = {}

io.on('connection',socket=>{
    // if this id is not present then add it
    if(users[socket.id]){
        users[socket.id] = socket.id;
    }
    socket.emit("yourId",socket.id);
    io.sockets.emit("allUsers",users)
    console.log("users are"+users)
    socket.on('disconnect',()=>{
        delete users[socket.id]
    })
    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit('hallo',{signal:data.signalData,from:data.from})
    })
    socket.on("acceptCall",(data)=>{
        io.to(data.to).emit('callAccepted',data.signal)
    })

   

});

server.listen(process.env.PORT)