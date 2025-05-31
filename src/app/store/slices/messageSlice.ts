import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../api/messages/messages.api.ts";

interface MessageState {
  privateMessages: Record<number, Message[]>;
  channelMessages: Record<number, Message[]>;
}

const initialState: MessageState = {
  privateMessages: {},
  channelMessages: {},
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      if (message.receiverId > 0 && message.senderId > 0) {
        const key = [message.senderId, message.receiverId]
          .sort((a, b) => a - b)
          .join("_");
        if (!state.privateMessages[Number(key)]) {
          state.privateMessages[Number(key)] = [];
        }
        const exists = state.privateMessages[Number(key)].some(
          (m) => m.id === message.id,
        );
        if (!exists) {
          state.privateMessages[Number(key)].unshift(message);
        }
      } else if (message.channelId > 0) {
        const channelId = message.channelId;
        if (!state.channelMessages[message.channelId]) {
          state.channelMessages[message.channelId] = [];
        }
        const exists = state.channelMessages[channelId].some(
          (m) => m.id === message.id,
        );
        if (!exists) {
          state.channelMessages[channelId].unshift(message);
        }
      }
    },

    modifyMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      if (message.receiverId > 0 && message.senderId > 0) {
        const key = [message.senderId, message.receiverId]
          .sort((a, b) => a - b)
          .join("_");
        if (state.privateMessages[Number(key)]) {
          const index = state.privateMessages[Number(key)].findIndex(
            (m) => m.id === message.id,
          );
          if (index !== -1) {
            state.privateMessages[Number(key)][index] = message;
          }
        }
      } else if (message.channelId > 0) {
        const channelId = message.channelId;
        if (state.channelMessages[channelId]) {
          const index = state.channelMessages[channelId].findIndex(
            (m) => m.id === message.id,
          );
          if (index !== -1) {
            state.channelMessages[channelId][index] = message;
          }
        }
      }
    },

    removeMessage: (
      state,
      action: PayloadAction<{
        messageId: number;
        channelId?: number;
      }>,
    ) => {
      const { messageId, channelId } = action.payload;

      if (channelId && channelId > 0) {
        state.channelMessages[channelId] = state.channelMessages[
          channelId
        ].filter((message) => message.id !== messageId);
      } else {
        Object.keys(state.privateMessages).forEach((key) => {
          state.privateMessages[Number(key)] = state.privateMessages[
            Number(key)
          ].filter((message) => message.id !== messageId);
        });
      }
    },
    clearMessages: (state) => {
      state.privateMessages = {};
      state.channelMessages = {};
    },
  },
});

export const { addMessage, modifyMessage, removeMessage, clearMessages } =
  messageSlice.actions;

export default messageSlice.reducer;
