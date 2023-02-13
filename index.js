import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import socket from 'socket.io'
import bodyParser from 'body-parser';
import userRouter from './src/router/userRouter'
import messageRouter from './src/router/messageRouter'

dotenv.config()

const app = express()

// middleware
app.use(bodyParser.json({ limit: "30mb", extended: true })); //limit uploads to 30mb
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); 
app.use(cors());

// connect to database
const URL = process.env.MONGOOSE_CONNECTION
mongoose.set('strictQuery', false);
mongoose
    .connect(URL,{ useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        console.log('connect database successfully')
    })
    .catch(err => console.log(err))


// routes users and messages  

app.use('/auth', userRouter)
app.use('/message', messageRouter)

// listen server
const server  = app.listen(process.env.PORT,() => {
    console.log('listening on port ' + process.env.PORT)
})
 
const io = socket(server,{
    cors: {
        origin: 'http://localhost:3000',
        credentials : true
    },
})

let usersSocket = []

io.on('connection',(socket) => {
    console.log('user' , usersSocket)
    // add new user on socket io
    socket.on('add-user-socket',(newUserId) => {
        // check if new user is not on userSocket)
        if(usersSocket){
            if(!usersSocket.find(user => user.userId === newUserId)){
                usersSocket.push({userId: newUserId, socketId : socket.id})
                console.log("New User Connected", usersSocket);
            }
        }else{
            usersSocket.push({userId: newUserId, socketId : socket.id})
        }
        // send all active users to new user socket (user onlined)
        io.emit('get-user-socket', usersSocket)
    })
    // send message a user socket
    socket.on('send-message-user', (data) => {
        const {receiverId} = data // id user receiveing message
        // find user socket (is user onlined)
        const user = usersSocket.find((user)=>user.userId === receiverId)
        if (user) {
            io.to(user.socketId).emit("recieve-new-message", data);
        }
    })

    // send request add friend socket
    socket.on('send-request-add-friend', (data) => {
        console.log("Data: ", {_id: data.id, ...data})
        const user = usersSocket.find((user)=>user.userId === data.idReceived) // kieerm tar lai
        // console.log("Sending from socket to :", data._id, data.name)

        // emit request to friend socket
        if (user) {
            console.log("recieve-send-request")
            io.to(user.socketId).emit("recieve-send-request-add-friend", data);
        }
        // console.log("Sending from socket");
    })


    socket.on('delete-request-add-friend', (data) => {
        console.log("delete-request-add-friend")
    });

    // emit add-friend success to sender requset
    socket.on('add-friend-success', (data) => {
        console.log("add-friend-success")
    });
    
    socket.on('disconnect', () => {
        // remove user when user disconnect socket
        usersSocket = usersSocket.filter((user) => user.socketId !== socket.id)
        // send all active users to all users
        console.log("New User Disconnected", usersSocket)
        io.emit("get-user-socket", usersSocket);
    })
})
