import { deleteMessage } from '@/app/actions/messageAction';
import { MessageDto } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Key, useCallback, useEffect, useState } from 'react';
import useMessageStore from './useMessageStore';

export const useMessage = (initialMessages: MessageDto[]) => {
  const set = useMessageStore((state) => state.set);
  const remove = useMessageStore((state) => state.remove);
  const messages = useMessageStore((state) => state.messages);
  const updateUnreadCount = useMessageStore((state) => state.updateUnreadCount);

  const searchParams = useSearchParams();
  const router = useRouter();
  const isOutbox = searchParams.get('container') === 'outbox';
  const [isDeleting, setDeleting] = useState({ id: '', loading: false });

  useEffect(() => {
    set(initialMessages);
    return () => {
      set([]);
    };
  }, [initialMessages, set]);

  const columns = [
    {
      key: isOutbox ? 'recipientName' : 'senderName',
      label: isOutbox ? 'Recipient' : 'Sender',
    },
    { key: 'text', label: 'Message' },
    { key: 'created', label: isOutbox ? 'Date sent' : 'Date received' },
    { key: 'actions', label: 'Actions' },
  ];

  const handleDeleteMessage = useCallback(
    async (message: MessageDto) => {
      setDeleting({ id: message.id, loading: true });
      await deleteMessage(message.id, isOutbox);
      remove(message.id);
      if (!message.dateRead && !isOutbox) updateUnreadCount(-1);
      setDeleting({ id: '', loading: false });
    },
    [isOutbox, remove, updateUnreadCount]
  );

  const handleRowSelect = (key: Key) => {
    const message = messages.find((m) => m.id === key);
    const url = isOutbox
      ? `/messages/${message?.recipientId}`
      : `/members/${message?.senderId}`;
    router.push(url + '/chat');
  };

  return {
    isOutbox,
    columns,
    deleteMessage: handleDeleteMessage,
    selectRow: handleRowSelect,
    isDeleting,
    messages,
  };
};
