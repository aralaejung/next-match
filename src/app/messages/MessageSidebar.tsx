'use client';

import clsx from 'clsx';
import { GoInbox } from 'react-icons/go';
import { MdOutlineOutbox } from 'react-icons/md';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState } from 'react';
import { Chip } from '@nextui-org/react';
import useMessageStore from '@/hooks/useMessageStore';

export default function MessageSidebar() {
  const unreadCount = useMessageStore((state) => state.unreadCount);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [selected, setSelected] = useState<string>(
    searchParams.get('container') || 'inbox'
  );

  const items = [
    { key: 'inbox', label: 'Inbox', icon: GoInbox, chip: true },
    { key: 'outbox', label: 'Outbox', icon: MdOutlineOutbox, chip: false },
  ];

  const handleSelect = (key: string) => {
    setSelected(key);
    const params = new URLSearchParams();
    params.set('container', key);
    router.replace(`${pathname}?${params}`);
  };
  return (
    <div className="flex flex-col shadow-md rounded-lg cursor-pointer">
      {items.map(({ key, icon: Icon, label, chip }) => (
        <div
          key={key}
          className={clsx('flex flex-row items-center rounded-t-lg gap-2 p-3', {
            'text-secondary font-semibold': selected === key,
            'text-black hover:text-secondary/70': selected !== key,
          })}
          onClick={() => handleSelect(key)}
        >
          <Icon size={24} />
          <div className="flex justify-between flex-grow">
            <span className="flex justify-between flex-grow">{label}</span>
            {chip && <Chip>{unreadCount}</Chip>}
          </div>
        </div>
      ))}
    </div>
  );
}
