// SignalRContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useSelector } from "react-redux";
import { selectAccessToken } from "../store/slices/authSlice.ts";
import {
  MessageForUserDto,
  MessageInChannelDto,
  Reaction,
  useCreateMessageReactionsMutation,
  useDeleteMessageReactionsMutation,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
} from "../api/messages/messages.api.ts";

interface SignalRContextType {
  isConnected: boolean;
  joinChannel: (channelId: number) => Promise<void>;
  sendUserMessage: (data: MessageForUserDto) => Promise<void>;
  sendChannelMessage: (data: MessageInChannelDto) => Promise<void>;
  sendReaction: (data: {
    messageId: Reaction["messageId"];
    content: Reaction["content"];
  }) => Promise<void>;
  deleteReaction: (data: {
    messageId: Reaction["messageId"];
    reactionId: Reaction["id"];
  }) => Promise<void>;
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback?: (...args: unknown[]) => void) => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const token = useSelector(selectAccessToken);
  const connectionRef = useRef<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<number | null>(null);

  // Message
  const [sendMessageForUser] = useMessagesForUserMutation();
  const [sendMessagesInChannel] = useMessagesInChannelMutation();
  // Reaction
  const [addReactionRequest] = useCreateMessageReactionsMutation();
  const [deleteReactionRequest] = useDeleteMessageReactionsMutation();

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

      connection.on("userconnected", (userData) => {
        console.log("✅ User connected:", userData);
      });

      connection.on("userdisconnected", (userData) => {
        console.log("✅ User user disconnected:", userData);
      });

      connection.onclose((error) => {
        console.error("SignalR connection closed:", error?.message);
        setIsConnected(false);
      });

      try {
        await connection.start();
        console.log("SignalR connected");
        setIsConnected(true);
      } catch (err) {
        console.error("Failed to connect to SignalR:", err);
      }

      connectionRef.current = connection;
    };

    connect();

    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
      setIsConnected(false);
    };
  }, [token]);

  const joinChannel = async (channelId: number) => {
    if (connectionRef.current && isConnected && currentChannel !== channelId) {
      try {
        await connectionRef.current.invoke("JoinChannel", channelId);
        console.log("Joined channel:", channelId);
        setCurrentChannel(channelId);
      } catch (err) {
        console.error("JoinChannel failed:", err);
      }
    }
  };

  const sendUserMessage = async (data: MessageForUserDto) => {
    if (connectionRef.current && isConnected) {
      try {
        await sendMessageForUser(data).unwrap();
      } catch (err) {
        console.error("sendUserMessage failed:", err);
      }
    }
  };

  const sendChannelMessage = async (data: MessageInChannelDto) => {
    if (connectionRef.current && isConnected) {
      try {
        await sendMessagesInChannel(data).unwrap();
      } catch (err) {
        console.error("sendChannelMessage failed:", err);
      }
    }
  };

  const sendReaction = async (data: {
    messageId: Reaction["messageId"];
    content: Reaction["content"];
  }) => {
    if (connectionRef.current && isConnected) {
      try {
        await addReactionRequest({
          messageId: data.messageId,
          content: data.content,
        }).unwrap();
      } catch (err) {
        console.error("addReaction failed:", err);
      }
    }
  };

  const deleteReaction = async (data: {
    messageId: Reaction["messageId"];
    reactionId: Reaction["id"];
  }) => {
    if (connectionRef.current && isConnected) {
      try {
        await deleteReactionRequest({
          messageId: data.messageId,
          reactionId: data.reactionId,
        }).unwrap();
      } catch (err) {
        console.error("deleteReaction failed:", err);
      }
    }
  };

  const on = (event: string, callback: (...args: unknown[]) => void) => {
    connectionRef.current?.on(event, callback);
  };

  const off = (event: string, callback?: (...args: unknown[]) => void) => {
    if (callback) {
      connectionRef.current?.off(event, callback);
    } else {
      connectionRef.current?.off(event);
    }
  };

  return (
    <SignalRContext.Provider
      value={{
        isConnected,
        joinChannel,
        sendUserMessage,
        sendChannelMessage,
        sendReaction,
        deleteReaction,
        on,
        off,
      }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (!context)
    throw new Error("useSignalR must be used within a SignalRProvider");
  return context;
};
