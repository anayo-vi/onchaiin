import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Missing required registration fields. Name, email, and password are required.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password is too weak. Must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email address is already registered. Please login or use a different email.' },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: 'USER',
        profile: {
          create: {},
        },
        wallets: {
          createMany: {
            data: [
              { currency: 'USDT', balance: 0.0, address: 'TR7' + Math.random().toString(36).substring(2, 15) },
              { currency: 'BTC', balance: 0.0, address: 'bc1q' + Math.random().toString(36).substring(2, 15) },
              { currency: 'ETH', balance: 0.0, address: '0x' + Math.random().toString(36).substring(2, 15) },
              { currency: 'TRX', balance: 0.0, address: 'T' + Math.random().toString(36).substring(2, 15) },
              { currency: 'LTC', balance: 0.0, address: 'LTC' + Math.random().toString(36).substring(2, 15) },
            ],
          },
        },
        notifications: {
          create: {
            title: 'Welcome to Onchaiin!',
            message: 'Your account and multi-currency crypto wallets have been provisioned.',
            type: 'SYSTEM',
          },
        },
      },
    });

    return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'Failed to create account due to server error.' }, { status: 500 });
  }
}
