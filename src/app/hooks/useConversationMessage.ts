import { useDispatch, useSelector } from "react-redux";
import {
  useLazyGetMessagesByChannelIdQuery,
  useLazyGetMessagesByUserIdQuery,
} from "../api/messages/messages.api";
import {
  addMessage,
  selectSortedChannelMessages,
  selectSortedMessagesByConversationKey,
} from "../store/slices/messageSlice";
import { RootState } from "../store/store";
import { useEffect, useState } from "react";

export function useConversationMessages({
  id,
  channelId,
}: {
  id?: string;
  channelId?: string;
}) {
  const dispatch = useDispatch();

  const pageSize = 20;
  const [pageNumber, setPageNumber] = useState(1);

  const userId = useSelector((state: RootState) => state.users.currentUserId);

  const [triggerLazyUserMessages] = useLazyGetMessagesByUserIdQuery();
  const [triggerLazyChannelMessages] = useLazyGetMessagesByChannelIdQuery();

  const channelMessages = useSelector(
    channelId ? selectSortedChannelMessages(Number(channelId)) : () => [],
  );
  const conversationKey = [userId, id].filter(Boolean).sort().join("_");
  const privateMessages = useSelector(
    selectSortedMessagesByConversationKey(conversationKey),
  );

  const messages = channelId ? channelMessages : privateMessages;
  const loadedCount = messages.length;
  const loadedPages = Math.ceil(loadedCount / pageSize);
  const [hasMoreMessages, setHasMoreMessages] = useState(
    () => messages.length % pageSize === 0 && messages.length !== 0,
  );

  const loadMessages = async (pageNumber: number) => {
    try {
      const fetchMessages = channelId
        ? triggerLazyChannelMessages
        : triggerLazyUserMessages;
      const params = channelId
        ? { Id: Number(channelId), pageNumber, pageSize }
        : { Id: Number(id), pageNumber, pageSize };
      const res = await fetchMessages(params).unwrap();
      for (const message of res) {
        dispatch(addMessage(message));
      }
      if (res.length < pageSize) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    if (messages.length === 0 && (id || channelId)) {
      console.log("inital load");
      loadMessages(1);
    }
  }, [channelId, id]);

  useEffect(() => {
    setHasMoreMessages(
      messages.length % pageSize === 0 && messages.length !== 0,
    );
  }, [messages.length]);

  const loadMore = async () => {
    if (pageNumber < loadedPages) {
      setPageNumber(pageNumber + 1);
      return;
    }

    if (!hasMoreMessages) return;
    const nextPage = pageNumber + 1;
    setPageNumber(nextPage);
    console.log("lazy load");
    await loadMessages(nextPage);
  };

  return { messages, userId, loadMore };
}
