import { Server } from 'socket.io';
import server from './app';

const io = new Server(server, {
  connectionStateRecovery: {}
});

io.on("connection", socket => {
  console.log(socket)
})

export default io
