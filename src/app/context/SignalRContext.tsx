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
  useDeleteMessageMutation,
  useDeleteMessageReactionsMutation,
  useMessagesForUserMutation,
  useMessagesInChannelMutation,
  useModifyMessageMutation,
} from "../api/messages/messages.api.ts";
import { SignalREventConstants } from "../constants/signalRConstants.ts";

interface SignalRContextType {
  // CONNECTION
  isConnected: boolean;
  isConnecting: boolean;
  joinChannel: (channelId: number) => Promise<void>;
  // MESSAGE
  sendUserMessage: (data: MessageForUserDto) => Promise<void>;
  editUserMessage: (data: {
    messageId: number;
    content: string;
  }) => Promise<void>;
  deleteUserMessage: (messageId: number) => Promise<void>;
  sendChannelMessage: (data: MessageInChannelDto) => Promise<void>;
  // REACTION
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
  const [isConnecting, setIsConnecting] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<number | null>(null);

  const actionQueueRef = useRef<(() => Promise<void>)[]>([]);

  // Message
  const [sendMessageForUser] = useMessagesForUserMutation();
  const [sendMessagesInChannel] = useMessagesInChannelMutation();
  const [modifyMessageRequest] = useModifyMessageMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  // Reaction
  const [addReactionRequest] = useCreateMessageReactionsMutation();
  const [deleteReactionRequest] = useDeleteMessageReactionsMutation();

  const executeWhenConnected = async (action: () => Promise<void>) => {
    if (isConnected && connectionRef.current) {
      await action();
    } else {
      actionQueueRef.current.push(action);
    }
  };

  const processActionQueue = async () => {
    while (actionQueueRef.current.length > 0) {
      const action = actionQueueRef.current.shift();
      if (action) {
        try {
          await action();
        } catch (err) {
          console.error("Error executing queued action:", err);
        }
      }
    }
  };

  useEffect(() => {
    if (!token) return;

    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_API_URL}/chatHub`, {
          accessTokenFactory: () => token,
        })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

      connection.on(SignalREventConstants.onUserConnected, (userData) => {
        console.log("✅ User connected:", userData);
      });

      connection.on(
        SignalREventConstants.onNotificationReceived,
        (notifData) => {
          console.log("Notification received:", notifData);
        },
      );

      connection.on(SignalREventConstants.onUserDisconnected, (userData) => {
        console.log("✅ User user disconnected:", userData);
      });

      connection.onclose((error) => {
        console.error("SignalR connection closed:", error?.message);
        setIsConnected(false);
        setIsConnecting(false);
      });

      connection.onreconnecting((error) => {
        console.log("SignalR reconnecting:", error?.message);
        setIsConnected(false);
        setIsConnecting(true);
      });

      connection.onreconnected((connectionId) => {
        console.log("SignalR reconnected:", connectionId);
        setIsConnected(true);
        setIsConnecting(false);
        processActionQueue();
      });

      try {
        await connection.start();
        console.log("SignalR connected");
        setIsConnected(true);
        setIsConnecting(false);
        await processActionQueue();
      } catch (err) {
        setIsConnecting(false);
        console.error("Failed to connect to SignalR:", err);
      }

      connectionRef.current = connection;
    };

    connect();

    return () => {
      connectionRef.current?.stop();
      connectionRef.current = null;
      setIsConnected(false);
      setIsConnecting(false);
      actionQueueRef.current = [];
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

  // MESSAGE
  const sendUserMessage = async (data: MessageForUserDto) => {
    if (connectionRef.current && isConnected) {
      try {
        console.log("Sending user message:", data);
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

  const editUserMessage = async (data: {
    messageId: number;
    content: string;
  }) => {
    if (connectionRef.current && isConnected) {
      try {
        await modifyMessageRequest(data).unwrap();
        console.log("Message edited:", data.messageId);
      } catch (err) {
        console.error("editUserMessage failed:", err);
      }
    }
  };

  const deleteUserMessage = async (messageId: number) => {
    if (connectionRef.current && isConnected) {
      try {
        deleteMessage(messageId).unwrap();
        console.log("Message deleted:", messageId);
      } catch (err) {
        console.error("deleteUserMessage failed:", err);
      }
    }
  };

  // REACTION
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
    if (connectionRef.current) {
      connectionRef.current.on(event, callback);
    } else {
      executeWhenConnected(async () => {
        connectionRef.current?.on(event, callback);
      });
    }
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
        isConnecting,
        joinChannel,
        sendUserMessage,
        sendChannelMessage,
        editUserMessage,
        deleteUserMessage,
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
