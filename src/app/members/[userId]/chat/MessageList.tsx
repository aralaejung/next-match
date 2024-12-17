'use client';

import { MessageDto } from '@/types';
import { useCallback, useEffect, useState } from 'react';
import MessageBox from './MessageBox';
import { pusherClient } from '@/lib/pusher';
import { formatShortDateTime } from '@/lib/util';
import { useRef } from 'react';
import { Channel } from 'pusher-js';
import useMessageStore from '@/hooks/useMessageStore';

type Props = {
  initialMessages: { messages: MessageDto[]; readCount: number };
  currentUserId: string;
  chatId: string;
};

export default function MessageList({
  initialMessages,
  currentUserId,
  chatId,
}: Props) {
  const setReadCount = useRef(false);
  const [messages, setMessages] = useState(initialMessages.messages);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);
  const channelRef = useRef<Channel | null>(null);

  useEffect(() => {
    if (!setReadCount.current) {
      updateUnreadCount(-initialMessages.readCount);
      setReadCount.current = true;
    }
  });
  const handleNewMessage = useCallback((message: MessageDto) => {
    setMessages((prevState) => {
      return [...prevState, message];
    });
  }, []);

  const handleReadMessage = useCallback((messageIds: string[]) => {
    setMessages((prevSate) =>
      prevSate.map((message) =>
        messageIds.includes(message.id)
          ? { ...message, dateRead: formatShortDateTime(new Date()) }
          : message
      )
    );
  }, []);

  useEffect(() => {
    if (!channelRef.current) {
      channelRef.current = pusherClient.subscribe(chatId);

      channelRef.current.bind('message:new', handleNewMessage);
      channelRef.current.bind('message:read', handleReadMessage);
    }

    return () => {
      if (channelRef.current && channelRef.current.subscribed) {
        channelRef.current.unsubscribe();
        channelRef.current.unbind('message:new');
        channelRef.current.unbind('messages:read', handleReadMessage);
      }
    };
  }, [chatId, handleNewMessage, handleReadMessage]);
  return (
    <div>
      {messages.length === 0 ? (
        'No messages to display'
      ) : (
        <div>
          {messages.map((message) => (
            <MessageBox
              key={message.id}
              message={message}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
