import React from 'react';
import MessageSidebar from './MessageSidebar';
import { getMessageByContainer } from '../actions/messageAction';
import MessageTable from './MessageTable';

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: { container: string };
}) {
  const message = await getMessageByContainer(searchParams.container);
  console.log(message);
  return (
    <div className="grid grid-cols-12 gap-5 h-[80vh] mt-10">
      <div className="col-span-2">
        <MessageSidebar />
      </div>
      <div className="col-span-10">
        <MessageTable messages={message} />
      </div>
    </div>
  );
}
