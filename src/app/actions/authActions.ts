'use server';

import { registerSchema, RegisterSchema } from '@/lib/schemas/registerSchema';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { ActionResult } from '@/types';
import { User } from '@prisma/client';
import { LoginSchema } from '@/lib/schemas/loginSchema';
import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { auth } from '@/auth';

export async function signInUser(
  data: LoginSchema
): Promise<ActionResult<string>> {
  try {
    //Check User in User database have or haven't
    const existingUser = await getUserByEmail(data.email);

    if (!existingUser || !existingUser.email)
      return { status: 'error', error: 'Invalid credentials' };

    //check not verify email  send verify email

    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    console.log(result);
    return { status: 'success', data: 'Logged in' };
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { status: 'error', error: 'Invalid credentials' };
        default:
          return { status: 'error', error: 'Something went wrong' };
      }
    } else {
      return { status: 'error', error: 'Something else went wrong' };
    }
  }
}

export async function signOutUser() {
  await signOut({ redirectTo: '/' });
}

export async function registerUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    //check data registerSchema

    if (!validated.success) {
      //throw new Error(validated.error.errors[0].message);
      return { status: 'error', error: validated.error.errors };
    }

    const { name, email, password } = validated.data;

    //create hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //check already have email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return { status: 'error', error: 'User already exists' };

    //create new user
    const user = prisma.user.create({
      data: {
        name,
        email,
        passwordHash: hashedPassword,
      },
    });

    return { status: 'success', data: user };
  } catch (error) {
    console.log(error);
    return { status: 'error', error: 'Something went wrong' };
  }
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getAuthUserId() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) throw new Error('Unauthorized');
  return userId;
}
