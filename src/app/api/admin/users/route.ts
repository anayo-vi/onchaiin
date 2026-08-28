import { verifyAdminSession } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getOrEnsurePrimaryUser } from '@/lib/ensureLeoUser';
import bcrypt from 'bcryptjs';

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let dbUsers = await prisma.user.findMany({
      include: {
        profile: true,
        wallets: true,
        transactions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbUsers.length === 0 || !dbUsers.some(u => u.role === 'USER')) {
      await getOrEnsurePrimaryUser();
      dbUsers = await prisma.user.findMany({
        include: {
          profile: true,
          wallets: true,
          transactions: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    const formattedUsers = dbUsers.map((u) => {
      const usdtWallet = u.wallets.find((w) => w.currency === 'USDT');
      const usdtBalance = usdtWallet ? Number(usdtWallet.balance) : 0;
      return {
        id: u.id,
        name: u.name || 'User',
        email: u.email,
        role: u.role,
        avatar: u.avatar || '/profile-pic.jpeg',
        kycStatus: u.kycStatus,
        isFrozen: u.isFrozen,
        usdtBalance: usdtBalance,
        phone: u.profile?.phone || 'N/A',
        city: u.profile?.city || 'N/A',
        country: u.profile?.country || 'United States',
        joinedDate: u.createdAt.toISOString().split('T')[0],
      };
    });

    return NextResponse.json({ success: true, users: formattedUsers });
  } catch (error: any) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST: Create a new User in PostgreSQL database
export async function POST(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, password, phone, city, country, initialBalance = 0, kycStatus = 'APPROVED' } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password || 'Password123!', 10);
    const balanceNum = parseFloat(initialBalance) || 0;

    const newUser = await prisma.user.create({
      data: {
        name: name || 'New User',
        email: email.toLowerCase().trim(),
        passwordHash,
        role: 'USER',
        kycStatus: kycStatus,
        avatar: '/profile-pic.jpeg',
        profile: {
          create: {
            phone: phone || '+1 (505) 555-0199',
            city: city || 'New Mexico',
            country: country || 'United States',
          },
        },
        wallets: {
          create: [
            { currency: 'USDT', balance: balanceNum, address: `TR7${(name || 'User').replace(/\s+/g, '')}UsdtAddress` },
          ],
        },
      },
      include: { profile: true, wallets: true },
    });

    if (balanceNum > 0) {
      const usdtWallet = newUser.wallets.find(w => w.currency === 'USDT');
      if (usdtWallet) {
        await prisma.walletTransaction.create({
          data: {
            userId: newUser.id,
            walletId: usdtWallet.id,
            type: 'CREDIT',
            amount: balanceNum,
            currency: 'USDT',
            reference: `INIT_${Date.now()}`,
            description: 'Account Opening Deposit Credit',
            status: 'COMPLETED',
          },
        });
      }
    }

    console.log(`👤 Admin created user ${newUser.email} in PostgreSQL database`);

    return NextResponse.json({ success: true, user: newUser });
  } catch (error: any) {
    console.error('Error creating user in DB:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

// PATCH: Update User Freeze status, KYC status, or profile details in PostgreSQL database
export async function PATCH(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { userId, isFrozen, kycStatus, name, phone, city, country } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Update User table fields
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(isFrozen !== undefined && { isFrozen }),
        ...(kycStatus && { kycStatus }),
        ...(name && { name }),
      },
    });

    // Update Profile table fields if provided
    if (phone || city || country) {
      await prisma.profile.upsert({
        where: { userId },
        update: {
          ...(phone && { phone }),
          ...(city && { city }),
          ...(country && { country }),
        },
        create: {
          userId,
          phone: phone || 'N/A',
          city: city || 'N/A',
          country: country || 'United States',
        },
      });
    }

    console.log(`✏️ Admin updated user ${userId} in PostgreSQL database:`, { isFrozen, kycStatus, name });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Error updating user in DB:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
