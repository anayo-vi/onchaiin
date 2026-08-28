import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function getOrEnsurePrimaryUser() {
  try {
    // STRICTLY find leogarcia39@onchaiin.com — never fall back to another user
    let user = await prisma.user.findFirst({
      where: { email: 'leogarcia39@onchaiin.com' },
      include: { profile: true, wallets: true, transactions: true },
    });

    if (!user) {
      // Only create if strictly not found — never use any other user as substitute
      const defaultPassword = await bcrypt.hash('Arthur2512', 10);
      user = await prisma.user.create({
        data: {
          email: 'leogarcia39@onchaiin.com',
          passwordHash: defaultPassword,
          name: 'Leo Garcia Arthur',
          role: 'USER',
          emailVerified: new Date(),
          avatar: '/profile-pic.jpeg',
          kycStatus: 'APPROVED',
          profile: {
            create: {
              phone: '+1 (505) 730-8886',
              country: 'United States',
              city: 'Albuquerque',
              state: 'New Mexico',
              zip: '87101',
              address: '123 Main Street, Apt 4B',
              is2FAEnabled: true,
            },
          },
          wallets: {
            create: [
              { currency: 'USDT', balance: 0.00, address: 'TR7LeoGarcia39UsdtAddress1234' },
              { currency: 'BTC', balance: 0.85, address: 'bc1qLeoGarcia39BtcAddress1234' },
              { currency: 'ETH', balance: 6.50, address: '0xLeoGarcia39EthAddress1234' },
              { currency: 'TRX', balance: 12000.0, address: 'TLeoGarcia39TrxAddress1234' },
              { currency: 'LTC', balance: 25.0, address: 'LTCLeoGarcia39LtcAddress1234' },
            ],
          },
        },
        include: { profile: true, wallets: true, transactions: true },
      });
      console.log('🌱 Auto-initialized primary user (leogarcia39@onchaiin.com) in DB');
    }

    return user;
  } catch (err) {
    console.error('Error ensuring primary user in DB:', err);
    return null;
  }
}
