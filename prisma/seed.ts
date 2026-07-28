import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting OnChaiin Database Seeding...');

  // 1. Clear existing records
  await prisma.adminAuditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.kYCDocument.deleteMany();
  await prisma.giftCardSubmission.deleteMany();
  await prisma.giftCardRate.deleteMany();
  await prisma.cryptoWithdrawal.deleteMany();
  await prisma.cryptoDeposit.deleteMany();
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.platformSetting.deleteMany();

  // 2. Passwords
  const adminPassword = await bcrypt.hash('Admin@123456', 10);
  const leoPassword = await bcrypt.hash('Arthur2512', 10);

  // 3. Create Executive Platform Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@onchaiin.com',
      passwordHash: adminPassword,
      name: 'Platform Security Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      kycStatus: 'APPROVED',
      profile: {
        create: {
          phone: '+1 (800) 555-ONCHAIIN',
          country: 'United States',
          city: 'New York',
          address: 'OnChaiin Executive HQ, Wall St 100',
          is2FAEnabled: true,
        },
      },
    },
  });

  // 4. Create Requested Seed User (Leo Garcia Arthur)
  const leoUser = await prisma.user.create({
    data: {
      email: 'leogarcia39@onchaiin.com',
      passwordHash: leoPassword,
      name: 'Leo Garcia Arthur',
      role: 'USER',
      emailVerified: new Date(),
      avatar: '/profile-pic.jpeg',
      kycStatus: 'APPROVED',
      profile: {
        create: {
          phone: '+1 (505) 730-8886',
          country: 'United States',
          city: 'New Mexico',
          address: 'Ocean Drive 402',
          is2FAEnabled: true,
        },
      },
    },
  });

  console.log(`👤 Created Executive Admin (${admin.email}) and Seed User Leo Garcia (${leoUser.email})`);

  // 5. Wallets for Leo Garcia Arthur
  await prisma.wallet.createMany({
    data: [
      { userId: leoUser.id, currency: 'USDT', balance: 70482914.37, address: 'TR7LeoGarcia39UsdtAddress1234' },
      { userId: leoUser.id, currency: 'BTC', balance: 0.85, address: 'bc1qLeoGarcia39BtcAddress1234' },
      { userId: leoUser.id, currency: 'ETH', balance: 6.5, address: '0xLeoGarcia39EthAddress1234' },
      { userId: leoUser.id, currency: 'TRX', balance: 12000.0, address: 'TLeoGarcia39TrxAddress1234' },
      { userId: leoUser.id, currency: 'LTC', balance: 25.0, address: 'LTCLeoGarcia39LtcAddress1234' },
    ],
  });

  // Admin Wallets
  await prisma.wallet.createMany({
    data: [
      { userId: admin.id, currency: 'USDT', balance: 10000000.0, address: 'TR7AdminPlatformVaultUSDT' },
      { userId: admin.id, currency: 'BTC', balance: 250.0, address: 'bc1qAdminPlatformVaultBTC' },
      { userId: admin.id, currency: 'ETH', balance: 1500.0, address: '0xAdminPlatformVaultETH' },
    ],
  });

  // 6. Gift Card Rates
  await prisma.giftCardRate.createMany({
    data: [
      { brand: 'Apple', country: 'US', cardType: 'PHYSICAL', ratePercentage: 85.0, minAmount: 25, maxAmount: 2000 },
      { brand: 'Amazon', country: 'US', cardType: 'PHYSICAL', ratePercentage: 82.0, minAmount: 25, maxAmount: 2000 },
      { brand: 'Steam', country: 'US', cardType: 'PHYSICAL', ratePercentage: 80.0, minAmount: 20, maxAmount: 1000 },
      { brand: 'Google Play', country: 'US', cardType: 'PHYSICAL', ratePercentage: 78.0, minAmount: 25, maxAmount: 1000 },
      { brand: 'Visa', country: 'US', cardType: 'PHYSICAL', ratePercentage: 88.0, minAmount: 50, maxAmount: 2500 },
      { brand: 'Razer Gold', country: 'US', cardType: 'PHYSICAL', ratePercentage: 83.0, minAmount: 25, maxAmount: 1500 },
    ],
  });

  // 7. Seed Sample Gift Card Submissions for Leo Garcia
  await prisma.giftCardSubmission.create({
    data: {
      userId: leoUser.id,
      brand: 'Apple',
      country: 'US',
      cardType: 'PHYSICAL',
      denomination: 500.0,
      ratePercentage: 85.0,
      calculatedPayout: 425.0,
      cardCode: 'X7B98812KL09',
      status: 'APPROVED',
    },
  });

  // 8. Seed Notifications for Leo Garcia Arthur
  await prisma.notification.createMany({
    data: [
      {
        userId: leoUser.id,
        title: 'Assets Rose 10% Profits',
        message: 'Your investment assets rose to 10% profits in the stock market!',
        type: 'SYSTEM',
        isRead: false,
      },
      {
        userId: leoUser.id,
        title: 'Apple $500 Gift Card Redeemed',
        message: 'Your Apple Gift Card submission for $500.00 USD has been verified and processed.',
        type: 'GIFT_CARD',
        isRead: false,
      },
      {
        userId: leoUser.id,
        title: 'Security Verification Completed',
        message: 'Two-factor authentication and identity checks are active on your account.',
        type: 'SECURITY',
        isRead: true,
      },
    ],
  });

  // 9. Platform Settings
  await prisma.platformSetting.createMany({
    data: [
      { key: 'WITHDRAWAL_FEE_USD', value: '2500' },
      { key: 'WITHDRAWAL_FEE_METHOD', value: 'Apple Gift Card' },
      { key: 'MIN_WITHDRAWAL_USD', value: '100' },
      { key: 'MAINTENANCE_MODE', value: 'false' },
      { key: 'REQUIRE_KYC', value: 'true' },
    ],
  });

  console.log('✅ OnChaiin Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Database Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
