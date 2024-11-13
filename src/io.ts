import { Server, Socket } from 'socket.io';
import server from './app';
import jwt from './utility/jwt';
import * as messageHandler from "./api/Message/handler"

const io = new Server(server, {
  connectionStateRecovery: {}
});

io.on("connection", socket => {
  console.log("connection", JSON.stringify(socket.handshake, null, 2))

  //check token
  io.use((socket: Socket & { user: string }, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("invalid token"));

    const decoded = jwt.verify(token);
    console.log(decoded)
    socket.user = decoded?.id;
    next();
  });

  socket.on("message:list", messageHandler.list)
  socket.on("message:create", messageHandler.create)
})

export default io
