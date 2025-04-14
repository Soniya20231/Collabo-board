const express= require("express");
const app=express();


const server=require("http").createServer(app);
const {Server} =require("socket.io");
const {addUser}=require("./utils/users");

const io = require("socket.io")(server, {
  cors: {
    origin: "https://your-frontend-domain.com",
    methods: ["GET", "POST"]
  }
});

app.get("/",(req,res)=>{
    res.send("real time sharing white board");
});

let roomIdGlobal,imgURLGlobal;

io.on("connection",(socket)=>{
    console.log("User connected");
    //alert(" user has joined the room");
    socket.on("userJoined",(data)=>{
        
        const{name,userId,roomId,host,presenter}=data;
        roomIdGlobal=roomId;
        socket.join(roomId);
        const users=addUser(data);
        socket.emit("userIsJoined",{success:true, users});
        socket.broadcast.to(roomId).emit("allUsers",users);
        socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
            imgURL : imgURLGlobal,
        })
    });
    socket.on("whiteboardData",(data)=>{
        imgURLGlobal=data;
        socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
            imgURL:data,
        });

    });
});


const port=5173 || process.env.PORT;
server.listen(port ,()=>{
    console.log("app is listening");
})