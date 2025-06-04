import { useDispatch, useSelector } from "react-redux";
import {
  useGetMessagesByChannelIdQuery,
  useGetMessagesByUserIdQuery,
} from "../api/messages/messages.api";
import {
  addMessage,
  selectSortedChannelMessages,
  selectSortedMessagesByConversationKey,
} from "../store/slices/messageSlice";
import { RootState } from "../store/store";
import { useEffect } from "react";
import { skipToken } from "@reduxjs/toolkit/query";

export function useConversationMessages({
  id,
  channelId,
}: {
  id?: string;
  channelId?: string;
}) {
  const dispatch = useDispatch();
  const userId = useSelector((state: RootState) => state.users.currentUserId);

  const userMessagesRequest = useGetMessagesByUserIdQuery(
    id ? Number(id) : skipToken,
  );
  const channelMessagesRequest = useGetMessagesByChannelIdQuery(
    channelId ? Number(channelId) : skipToken,
  );

  const channelMessages = useSelector(
    channelId ? selectSortedChannelMessages(Number(channelId)) : () => [],
  );
  const conversationKey = [userId, id].filter(Boolean).sort().join("_");
  const privateMessages = useSelector(
    selectSortedMessagesByConversationKey(conversationKey),
  );

  const messages = channelId ? channelMessages : privateMessages;
  const oldMessages = channelId
    ? channelMessagesRequest.data
    : userMessagesRequest.data;

  useEffect(() => {
    if (oldMessages) {
      oldMessages.forEach((message) => {
        dispatch(addMessage(message));
      });
    }
  }, [oldMessages, dispatch]);

  return { messages, oldMessages, userId };
}
