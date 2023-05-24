import { Server } from "socket.io";
import allowedOrigins from "./allowedOrigins.js";
import redisClient from "./redisConfig.js";

const socketInitialisation = (server) => {
    // socket io initialization
    const io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    })

    // on connection
    io.on('connection', (socket) => {
        console.log('User Connected: ' + socket.id);
        socket.on('join-meet', async (meetcode, peerId) => {
            socket.join(meetcode);
            socket.peerId = peerId;
            socket.emit('message', { peerId, meetcode });
            console.log('peerId: ' + peerId);
            const listExists = await redisClient.exists(meetcode)
            const usersListString = listExists === 0 ? JSON.stringify(new Array()) : await redisClient.get(meetcode)
            const usersListParsed = JSON.parse(usersListString) || [];
            console.log(usersListParsed);
            usersListParsed.push(socket.peerId);
            const usersSetParsed = new Set(usersListParsed);
            io.to(meetcode).emit('get-users', Array.from(usersSetParsed));
            await redisClient.set(meetcode, JSON.stringify(Array.from(usersSetParsed)));
            await redisClient.set(socket.peerId, meetcode);
            console.log('broadcasting peerId');
            socket.broadcast.to(meetcode).emit('joined-meet', peerId);
            console.log('broadcasted peerId');
            // socket.emit('get-users', Array.from(usersSetParsed));
            console.log(`joined room successfully!!! [${socket.peerId} --> ${meetcode}]`);
        })
        socket.on('disconnect', async () => {
            console.log('disconnected: ' + socket.id)
            const meetcode = await redisClient.get(socket.peerId);
            const listExists = await redisClient.exists(meetcode)
            const usersListString = listExists === 0 ? JSON.stringify(new Array()) : await redisClient.get(meetcode)
            const usersListParsed = JSON.parse(usersListString);
            console.log(usersListParsed);
            const usersSetParsed = new Set(usersListParsed);
            usersSetParsed.delete(socket.peerId);
            if (usersSetParsed.size === 0) {
                await redisClient.del(meetcode);
            } else {
                await redisClient.set(meetcode, JSON.stringify(Array.from(usersSetParsed)));
            }
            await redisClient.del(socket.peerId);
            socket.broadcast.to(meetcode).emit('user-disconnected', socket.peerId);
        })
        socket.on('stream-change', (meetcode, data) => {
            socket.broadcast.to(meetcode).emit('stream-change', socket.peerId, data);
        });
        socket.on("update-stream", (meetcode, peerId) => {
            socket.broadcast.to(meetcode).emit('user-disconnected', peerId);
            socket.broadcast.to(meetcode).emit('joined-meet', peerId);
        })
    })
}

export default socketInitialisation;
