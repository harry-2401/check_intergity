import * as dotenv from "dotenv";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { checkIntegrityMessage, hashData } from "./hash";
dotenv.config();

// Sever run on port 3000
const PORT = 3000;

//get secret_key from file .env
const SECRET_KEY = process.env.SECRET_KEY as string;

//defined event
const EVENT = {
  RECEIVER_DATA_FROM_CLIENT: "receirverDataFromClient",
  SEND_DATA_FROM_SERVER: "sendDataFromServer",
};

// create server
const httpServer = createServer();

// create instance socketio
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3001",
  },
});

//listen event
io.on("connection", (socket: Socket) => {
  console.log(`Client ${socket.id} connected!`);
  //listen event RECEIVER_DATA_FROM_CLIENT from client
  socket.on(EVENT.RECEIVER_DATA_FROM_CLIENT, ({ message, hashCode }) => {
    console.log("Nhan tu client: ", message);

    if (checkIntegrityMessage(hashCode, SECRET_KEY, message)) {
      const dataToClient = {
        message: `Hello, I am B19DCAT033 server`,
        hashCode: hashData("Hello, I am B19DCAT033 server", SECRET_KEY),
      };

      console.log("Gui tu server: ", dataToClient);
      //send data with event SEND_DATA_FROM_SERVER from server to client
      socket.emit(EVENT.SEND_DATA_FROM_SERVER, dataToClient);
    } else {
      console.log("The received message has lost its integrity.");
    }
  });

  socket.on("disconnect", () => {
    console.log(`client ${socket.id} disconneted`);
  });
});

//server start listen on port 3000
httpServer.listen(PORT);
