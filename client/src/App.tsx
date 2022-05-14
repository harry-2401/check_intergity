import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { checkIntegrityMessage, hashData } from "./utils/hash";
import SocketClient from "./socket";

type DataFromServer = {
  message: string;
  hashCode: string;
};

function App() {
  //create instance socketio
  const socket = useRef<Socket>(SocketClient);

  //defined event
  const event = useRef<{
    RECEIVER_DATA_FROM_CLIENT: string;
    SEND_DATA_FROM_SERVER: string;
  }>({
    RECEIVER_DATA_FROM_CLIENT: "receirverDataFromClient",
    SEND_DATA_FROM_SERVER: "sendDataFromServer",
  });
  const messageToServer = useRef<string>("Hello, I am B19DCAT033 client");

  const [messageReceiverFromServer, setMessageReceiverFromServer] = useState<
    string | null
  >(null);

  const [error, setError] = useState<string>("");
  // get secret key from file env
  const secretKey = useRef<string>(process.env.REACT_APP_SECRET_KEY as string);

  useEffect(() => {
    //listen event from server with event SEND_DATA_FROM_SERVER
    socket.current.on(
      event.current.SEND_DATA_FROM_SERVER,
      ({ message, hashCode }: DataFromServer) => {
        if (checkIntegrityMessage(hashCode, secretKey.current, message)) {
          setMessageReceiverFromServer(message);
        } else {
          setError("The received message has lost its integrity.");
        }
      }
    );
  }, [socket]);

  const handleSendDataToServer = (): void => {
    setError("");
    //send data to server with event RECEIVER_DATA_FROM_CLIENT
    socket.current.emit(event.current.RECEIVER_DATA_FROM_CLIENT, {
      message: messageToServer.current,
      hashCode: hashData(messageToServer.current, secretKey.current),
    });
  };

  return (
    <div className="App">
      <button onClick={handleSendDataToServer}>Send data to server</button>
      {messageReceiverFromServer && (
        <div>
          <h2>Gui tu client: {messageToServer.current}</h2>
          <h2>Nhan tu server: {messageReceiverFromServer}</h2>
        </div>
      )}
      {error && <h2 style={{ color: "red" }}>{error}</h2>}
    </div>
  );
}

export default App;
