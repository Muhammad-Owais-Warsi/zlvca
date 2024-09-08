import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();

io.on("connection", (socket) => {
    console.log(socket.id);

    socket.on("enter",  (data) => {
        emailToSocketIdMap.set(data.email, socket.id);
        socketIdToEmailMap.set(socket.id, data.email);
        socket.join(data.code);
     
   
        io.to(data.code).emit("join", { email: data.email, code: data.code });
        io.to(socket.id).emit("enter", data);

    });

    socket.on("call",(data) => {
        const {to,offer} = data;
        console.log("Call",to,offer);
        io.to(to).emit("incoming:call",{from:socket.id,offer});
    })


    socket.on("answer",(data) => {
        const {from,answer} = data;
        io.to(from).emit("answer",{from,answer});
    })

});

server.listen(9000, () => {
    console.log("Server is running on port 9000");
});
