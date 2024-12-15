import { getMemberByUserId } from '@/app/actions/memberActions';
import { notFound } from 'next/navigation';

import CardInnerWrapper from '@/components/CardInnerWrapper';

export default async function MemberDetailedPage({
  params,
}: {
  params: { userId: string };
}) {
  const { userId } = await Promise.resolve(params);
  const member = await getMemberByUserId(userId);

  if (!member) return notFound();

  return (
    <CardInnerWrapper header="Profile" body={<div>{member.description}</div>} />
  );
}
