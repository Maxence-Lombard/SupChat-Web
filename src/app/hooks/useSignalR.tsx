import { useEffect, useRef, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../store/slices/messageSlice.ts";
import { selectAccessToken } from "../store/slices/authSlice.ts";
import { Message } from "../api/messages/messages.api.ts";

const useSignalR = () => {
  const [isConnected, setIsConnected] = useState(false);
  const token = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const connectionRef = useRef<HubConnection | null>(null);

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

  const sendUserMessage = async (data: {
    content: string;
    receiverId: number;
    parentId?: number;
  }) => {
    if (connectionRef.current && isConnected) {
      try {
        await connectionRef.current.invoke(
          "SendUserMessage",
          data.content,
          data.receiverId,
        );
      } catch (err) {
        console.error("Error when sending message :", err);
      }
    }
  };

  const sendChannelMessage = async (data: {
    content: string;
    channelId: number;
    parentId?: number;
  }) => {
    if (connectionRef.current && isConnected) {
      try {
        await connectionRef.current.invoke(
          "SendUserMessage",
          data.content,
          data.channelId,
        );
      } catch (err) {
        console.error("Error when sending message :", err);
      }
    }
  };

  return { isConnected, sendUserMessage, sendChannelMessage };
};

export default useSignalR;
