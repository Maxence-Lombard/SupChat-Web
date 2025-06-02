import { useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/slices/messageSlice.ts";
import { selectAccessToken } from "../store/slices/authSlice.ts";
import {
  Message,
  MessageForUserDto,
  MessageInChannelDto,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
} from "../api/messages/messages.api.ts";

const useSignalR = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<number | null>(null);
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const connectionRef = useRef<HubConnection | null>(null);

  const [sendMessageForUser] = useMessagesForUserMutation();
  const [sendMessagesInChannel] = useMessagesInChannelMutation();

  useEffect(() => {
    if (!token) return;

    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl("http://localhost:5263/chatHub", {
          accessTokenFactory: () => token,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      connection.on("ReceiveMessage", (message: Message) => {
        console.log("Received message:", message);
        dispatch(addMessage(message));
      });

      connection.on("UserConnected", (connectionId) => {
        console.log("User connected :", connectionId);
      });

      connection.onclose((error) => {
        console.error("Connexion closed :", error?.message);
        setIsConnected(false);
      });

      try {
        await connection.start();
        console.log("Connected to SignalR");
        setIsConnected(true);
      } catch (err) {
        console.error("Connection to SignalR failed :", err);
      }

      connectionRef.current = connection;
    };

    connect();

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [token]);

  // TODO: modifier fonctionnement pour écouter lors de l'utilisation de la fonction
  // const listenReceiveMessage = async () => {
  //   if (connectionRef.current && isConnected) {
  //     try {
  //       connectionRef.on("ReceiveMessage", (message: Message) => {
  //         console.log("Received message:", message);
  //         dispatch(addMessage(message));
  //       });
  //     } catch (err) {
  //       console.error("Error when receiving message :", err);
  //     }
  //   }
  // };

  const joinChannel = async (channelId: number) => {
    if (connectionRef.current && isConnected && currentChannel !== channelId) {
      try {
        await connectionRef.current.invoke("JoinChannel", channelId);
        console.log("Connected to the channel :", channelId);
        setCurrentChannel(channelId);
      } catch (err) {
        console.error("Error when joining channel :", err);
      }
    }
  };

  const sendUserMessage = async (data: MessageForUserDto) => {
    if (connectionRef.current && isConnected) {
      try {
        await sendMessageForUser(data).unwrap();
      } catch (err) {
        console.error("Error when sending message :", err);
      }
    }
  };

  const sendChannelMessage = async (data: MessageInChannelDto) => {
    if (connectionRef.current && isConnected) {
      try {
        await sendMessagesInChannel(data).unwrap();
      } catch (err) {
        console.error("Error when sending message :", err);
      }
    }
  };

  return { isConnected, joinChannel, sendUserMessage, sendChannelMessage };
};

export default useSignalR;
