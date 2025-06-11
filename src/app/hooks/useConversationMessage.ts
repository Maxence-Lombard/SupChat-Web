import { useDispatch, useSelector } from "react-redux";
import {
  useLazyGetMessagesByChannelIdQuery,
  useLazyGetMessagesByUserIdQuery,
} from "../api/messages/messages.api";
import {
  addMessages,
  clearConversationMessages,
  selectSortedChannelMessages,
  selectSortedMessagesByConversationKey,
} from "../store/slices/messageSlice";
import { RootState } from "../store/store";
import { useEffect, useMemo, useRef, useState } from "react";

export function useConversationMessages({
  id,
  channelId,
}: {
  id?: string;
  channelId?: string;
}) {
  const dispatch = useDispatch();

  const prevIdRef = useRef<string>();
  const prevChannelIdRef = useRef<string>();
  const pageSize = 20;
  const [pageNumber, setPageNumber] = useState(1);
  const [shouldLoadMessages, setShouldLoadMessages] = useState(false);

  const userId = useSelector((state: RootState) => state.users.currentUserId);

  const [triggerLazyUserMessages] = useLazyGetMessagesByUserIdQuery();
  const [triggerLazyChannelMessages] = useLazyGetMessagesByChannelIdQuery();

  const conversationKey = useMemo(
    () => [userId, id].filter(Boolean).sort().join("_"),
    [userId, id],
  );
  const emptyArray = useMemo(() => [], []);
  const channelMessages = useSelector(
    channelId
      ? selectSortedChannelMessages(Number(channelId))
      : () => emptyArray,
  );
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
      const messages = await fetchMessages(params).unwrap();
      dispatch(addMessages(messages));
      if (messages.length < pageSize) {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  useEffect(() => {
    const conversationChanged =
      (id && prevIdRef.current && prevIdRef.current !== id) ||
      (channelId &&
        prevChannelIdRef.current &&
        prevChannelIdRef.current !== channelId) ||
      (!prevIdRef.current && !prevChannelIdRef.current && (id || channelId));

    if (conversationChanged) {
      if (prevIdRef.current && id && prevIdRef.current !== id) {
        const oldConversationKey = [userId, prevIdRef.current]
          .filter(Boolean)
          .sort()
          .join("_");
        dispatch(clearConversationMessages(oldConversationKey));
      }

      setPageNumber(1);
      setHasMoreMessages(true);
      setShouldLoadMessages(true);
    }

    prevIdRef.current = id;
    prevChannelIdRef.current = channelId;
  }, [id, channelId, userId, dispatch]);

  useEffect(() => {
    if (shouldLoadMessages && (id || channelId)) {
      loadMessages(1);
      setShouldLoadMessages(false);
    }
  }, [shouldLoadMessages, id, channelId]);

  useEffect(() => {
    if (messages.length === 0 && (id || channelId) && !shouldLoadMessages) {
      loadMessages(1);
    }
  }, [channelId, id, messages.length, shouldLoadMessages]);

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
    await loadMessages(nextPage);
  };

  return { messages, userId, loadMore };
}
