'use client';
import {
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Card,
} from '@nextui-org/react';

import { MessageDto } from '@/types';

import MessageTableCell from './MessageTableCell';
import { useMessage } from '@/hooks/useMessages';

type Props = {
  initialMessages: MessageDto[];
};

export default function MessageTable({ initialMessages }: Props) {
  const { isOutbox, columns, deleteMessage, selectRow, isDeleting, messages } =
    useMessage(initialMessages);
  return (
    <Card className="flex flex-col gap-3 h-[80vh] overflow-auto">
      <Table
        aria-label="Table with message"
        selectionMode="single"
        onRowAction={(key) => selectRow(key)}
        shadow="none"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              width={column.key === 'text' ? '50%' : undefined}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={messages}
          emptyContent="No messages fro this container"
        >
          {(item) => (
            <TableRow key={item.id} className="cursor-pointer">
              {(columnKey) => (
                <TableCell
                  className={`${
                    !item.dateRead && !isOutbox ? 'font-semibold' : ''
                  }`}
                >
                  <MessageTableCell
                    item={item}
                    columnKey={columnKey as string}
                    isOutbox={isOutbox}
                    deleteMessage={deleteMessage}
                    isDeleting={isDeleting.loading && isDeleting.id === item.id}
                  />
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
