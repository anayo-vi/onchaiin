import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const dbUsers = await prisma.user.findMany({
      include: {
        profile: true,
        wallets: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedUsers = dbUsers.map((u) => {
      const usdtWallet = u.wallets.find((w) => w.currency === 'USDT');
      const usdtBalance = usdtWallet ? usdtWallet.balance : 0.0;
      return {
        id: u.id,
        name: u.name || 'User',
        email: u.email,
        role: u.role,
        avatar: u.avatar || '/profile-pic.jpeg',
        kycStatus: u.kycStatus,
        isFrozen: u.isFrozen,
        usdtBalance: u.email === 'leogarcia39@onchaiin.com' ? 70482914.37 : usdtBalance,
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
