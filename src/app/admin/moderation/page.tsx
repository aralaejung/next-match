import { getUnapprovedPhotos } from '@/app/actions/adminAction';
import MemberPhotos from '@/components/MemberPhotos';
import { Divider } from '@nextui-org/react';

export default async function PhotoModeration() {
  const photos = await getUnapprovedPhotos();
  return (
    <div className="flex flex-col mt-10 gap-3">
      <h3 className="text-2xl">Photo awaiting moderation</h3>
      <Divider />
      <MemberPhotos photos={photos} />
    </div>
  );
}
