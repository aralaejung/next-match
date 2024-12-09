'use client';
import { calculateAge } from '@/lib/util';
import {
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Button,
} from '@nextui-org/react';
import Link from 'next/link';
import { Member } from '@prisma/client';
import { usePathname } from 'next/navigation';

type Props = {
  member: Member;
  navLinks: { name: string; href: string }[];
};

export default function MemberSidebar({ member, navLinks }: Props) {
  const pathname = usePathname();

  return (
    <Card className="w-full mt-10 items-center h-[80vh]">
      <Image
        height={200}
        width={200}
        src={member.image || '/images/user.png'}
        alt="User profile main image"
        className="rounded-full mt-6 aspect-square object-cover"
      />
      <CardBody>
        <div className="flex flex-col items-center">
          <div className="text-2xl">
            {member.name} ,{calculateAge(member.dateOfBirth)}
          </div>
          <div className="text-sm text-neutral-500">
            {member.city},{member.country}
          </div>
          <Divider className="my-3" />
          <nav className="flex flex-col p-4 text-2xl gap-4">
            {navLinks.map((link) => (
              <Link
                href={link.href}
                key={link.name}
                className={`block rounded ${
                  pathname === link.href
                    ? 'text-secondary'
                    : 'hover:text-secondary/50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </CardBody>
      <CardFooter>
        <Button
          as={Link}
          href="/members"
          fullWidth
          color="secondary"
          variant="bordered"
        >
          Go back
        </Button>
      </CardFooter>
    </Card>
  );
}