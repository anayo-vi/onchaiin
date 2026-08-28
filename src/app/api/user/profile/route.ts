import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatar, phone, address, city, state, country, zip, dob } = body;

    // Update User table in PostgreSQL
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
    });

    // Update or Create Profile table
    if (phone || address || city || state || country || zip || dob) {
      await prisma.profile.upsert({
        where: { userId: session.user.id },
        update: {
          ...(phone && { phone }),
          ...(address && { address }),
          ...(city && { city }),
          ...(state && { state }),
          ...(country && { country }),
          ...(zip && { zip }),
          ...(dob && { dob }),
        },
        create: {
          userId: session.user.id,
          phone: phone || '+1 (505) 730-8886',
          address: address || '123 Main Street, Apt 4B',
          city: city || 'Albuquerque',
          state: state || 'New Mexico',
          country: country || 'United States',
          zip: zip || '87101',
          dob: dob || '',
        },
      });
    }

    console.log(`👤 Updated profile & avatar in database for user ${session.user.id}:`, {
      name: updatedUser.name,
      avatar: updatedUser.avatar,
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user profile in DB:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true, wallets: true },
    });

    // If profile is null or missing address/phone/city/state/zip, initialize profile defaults in DB
    if (user && !user.profile) {
      const newProfile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          phone: '+1 (505) 730-8886',
          address: '123 Main Street, Apt 4B',
          city: 'Albuquerque',
          state: 'New Mexico',
          country: 'United States',
          zip: '87101',
        },
      });
      user = { ...user, profile: newProfile };
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}
