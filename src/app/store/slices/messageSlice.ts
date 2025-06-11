import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Message } from "../../api/messages/messages.api.ts";
import { RootState } from "../store.ts";

interface MessageState {
  privateMessages: Record<string, Message[]>;
  channelMessages: Record<number, Message[]>;
  byId: Record<number, Message>;
}

const initialState: MessageState = {
  privateMessages: {},
  channelMessages: {},
  byId: {},
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      state.byId[message.id] = message;
      if (message.receiverId > 0 && message.senderId > 0) {
        const key = [message.senderId, message.receiverId]
          .sort((a, b) => a - b)
          .join("_");
        if (!state.privateMessages[key]) {
          state.privateMessages[key] = [];
        }
        const exists = state.privateMessages[key].some(
          (m) => m.id === message.id,
        );
        if (!exists) {
          state.privateMessages[key].unshift(message);
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

    addMessages: (state, action: PayloadAction<Message[]>) => {
      action.payload.forEach((message) => {
        // Ajouter au byId
        state.byId[message.id] = message;

        if (message.receiverId > 0 && message.senderId > 0) {
          const key = [message.senderId, message.receiverId]
            .sort((a, b) => a - b)
            .join("_");
          if (!state.privateMessages[key]) {
            state.privateMessages[key] = [];
          }
          const exists = state.privateMessages[key].some(
            (m) => m.id === message.id,
          );
          if (!exists) {
            state.privateMessages[key].push(message);
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
            state.channelMessages[channelId].push(message);
          }
        }
      });
    },

    modifyMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;

      state.byId[message.id] = message;
      if (message.receiverId > 0 && message.senderId > 0) {
        const key = [message.senderId, message.receiverId]
          .sort((a, b) => a - b)
          .join("_");
        if (state.privateMessages[key]) {
          const index = state.privateMessages[key].findIndex(
            (m) => m.id === message.id,
          );
          if (index !== -1) {
            state.privateMessages[key][index] = message;
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

      delete state.byId[messageId];
      if (channelId && channelId > 0) {
        state.channelMessages[channelId] = state.channelMessages[
          channelId
        ].filter((message) => message.id !== messageId);
      } else {
        Object.keys(state.privateMessages).forEach((key) => {
          state.privateMessages[key] = state.privateMessages[key].filter(
            (message) => message.id !== messageId,
          );
        });
      }
    },
    clearMessages: (state) => {
      state.privateMessages = {};
      state.channelMessages = {};
      state.byId = {};
    },

    clearConversationMessages: (state, action: PayloadAction<string>) => {
      const conversationKey = action.payload;
      if (state.privateMessages[conversationKey]) {
        state.privateMessages[conversationKey].forEach((msg) => {
          delete state.byId[msg.id];
        });
      }
      delete state.privateMessages[conversationKey];
    },
  },
});

export const selectPrivateMessages = (state: RootState) =>
  state.messages.privateMessages;

export const selectSortedMessagesByConversationKey = (
  conversationKey: string,
) =>
  createSelector([selectPrivateMessages], (privateMessages) => {
    const messages = privateMessages[conversationKey] || [];
    return [...messages].sort((a, b) => a.id - b.id);
  });

export const selectChannelMessages = (state: RootState) =>
  state.messages.channelMessages;

export const selectMessageById = (
  state: RootState,
  messageId: number,
): Message | undefined => {
  return state.messages.byId[messageId];
};

export const selectSortedChannelMessages = (channelId: number) =>
  createSelector([selectChannelMessages], (channelMessages) => {
    const messages = channelMessages[channelId] || [];
    return [...messages].sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));
  });

export const {
  addMessage,
  addMessages,
  modifyMessage,
  removeMessage,
  clearMessages,
  clearConversationMessages,
} = messageSlice.actions;

export default messageSlice.reducer;
