import io from "socket.io-client";

//connect to server with port 3000
const SocketClient = io("ws://localhost:3000");

export default SocketClient;
