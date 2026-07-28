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
  const userPassword = await bcrypt.hash('User@123456', 10);
  const leoPassword = await bcrypt.hash('Arthur2512', 10);

  // 3. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@onchaiin.com',
      passwordHash: adminPassword,
      name: 'System Admin',
      role: 'ADMIN',
      emailVerified: new Date(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      kycStatus: 'APPROVED',
      profile: {
        create: {
          phone: '+1 (555) 019-2834',
          country: 'United States',
          city: 'New York',
          address: 'Wall Street 100',
          is2FAEnabled: true,
        },
      },
    },
  });

  // 4. Create Standard User (Alex Vance)
  const user = await prisma.user.create({
    data: {
      email: 'user@onchaiin.com',
      passwordHash: userPassword,
      name: 'Alex Vance',
      role: 'USER',
      emailVerified: new Date(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      kycStatus: 'APPROVED',
      profile: {
        create: {
          phone: '+1 (555) 839-2019',
          country: 'United States',
          city: 'San Francisco',
          address: 'Market St 742',
          is2FAEnabled: false,
        },
      },
    },
  });

  // 5. Create Requested Seed User (Leo Garcia)
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
          phone: '+1 (555) 392-1092',
          country: 'United States',
          city: 'Miami',
          address: 'Ocean Drive 402',
          is2FAEnabled: true,
        },
      },
    },
  });

  console.log(`👤 Created Admin (${admin.email}), User (${user.email}), and Leo Garcia (${leoUser.email})`);

  // 6. Create Wallets for User
  const btcWallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: 'BTC',
      balance: 0.425,
      pendingBalance: 0.05,
      address: 'bc1q9x0y2p3w4e5r6t7y8u9i0o1p2a3s4d5f6g7h8j',
    },
  });

  const ethWallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: 'ETH',
      balance: 4.18,
      pendingBalance: 0.0,
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    },
  });

  const usdtWallet = await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: 'USDT',
      balance: 1450.75,
      pendingBalance: 200.0,
      address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    },
  });

  await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: 'TRX',
      balance: 5200.0,
      pendingBalance: 0.0,
      address: 'T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb',
    },
  });

  await prisma.wallet.create({
    data: {
      userId: user.id,
      currency: 'LTC',
      balance: 12.5,
      pendingBalance: 0.0,
      address: 'LTC1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    },
  });

  // Wallets for Leo Garcia
  await prisma.wallet.createMany({
    data: [
      { userId: leoUser.id, currency: 'USDT', balance: 3500.0, address: 'TR7LeoGarcia39UsdtAddress1234' },
      { userId: leoUser.id, currency: 'BTC', balance: 0.85, address: 'bc1qLeoGarcia39BtcAddress1234' },
      { userId: leoUser.id, currency: 'ETH', balance: 6.5, address: '0xLeoGarcia39EthAddress1234' },
      { userId: leoUser.id, currency: 'TRX', balance: 12000.0, address: 'TLeoGarcia39TrxAddress1234' },
      { userId: leoUser.id, currency: 'LTC', balance: 25.0, address: 'LTCLeoGarcia39LtcAddress1234' },
    ],
  });

  // Admin Wallets
  await prisma.wallet.createMany({
    data: [
      { userId: admin.id, currency: 'BTC', balance: 15.5, address: 'bc1qadminbtcaddress1234567890' },
      { userId: admin.id, currency: 'ETH', balance: 120.0, address: '0xadminethaddress1234567890' },
      { userId: admin.id, currency: 'USDT', balance: 250000.0, address: 'TR7adminusdtaddress1234567890' },
      { userId: admin.id, currency: 'TRX', balance: 500000.0, address: 'Tadmin trx address 1234567890' },
      { userId: admin.id, currency: 'LTC', balance: 450.0, address: 'LTCadminltcaddress1234567890' },
    ],
  });

  console.log('💼 Wallets initialized for all seeded accounts');

  // 7. Gift Card Exchange Rates
  const brands = [
    { brand: 'Apple', country: 'US', cardType: 'PHYSICAL', rate: 85.0 },
    { brand: 'Apple', country: 'US', cardType: 'ECODE', rate: 80.0 },
    { brand: 'Amazon', country: 'US', cardType: 'PHYSICAL', rate: 82.0 },
    { brand: 'Amazon', country: 'US', cardType: 'ECODE', rate: 78.0 },
    { brand: 'Steam', country: 'US', cardType: 'PHYSICAL', rate: 88.0 },
    { brand: 'Steam', country: 'US', cardType: 'ECODE', rate: 84.0 },
    { brand: 'Google Play', country: 'US', cardType: 'PHYSICAL', rate: 79.0 },
    { brand: 'Google Play', country: 'US', cardType: 'ECODE', rate: 74.0 },
    { brand: 'Visa', country: 'US', cardType: 'PHYSICAL', rate: 90.0 },
    { brand: 'Vanilla', country: 'US', cardType: 'PHYSICAL', rate: 87.0 },
    { brand: 'Razer Gold', country: 'GLOBAL', cardType: 'ECODE', rate: 86.0 },
    { brand: 'Nike', country: 'US', cardType: 'PHYSICAL', rate: 75.0 },
    { brand: 'Sephora', country: 'US', cardType: 'PHYSICAL', rate: 76.0 },
    { brand: 'eBay', country: 'US', cardType: 'ECODE', rate: 81.0 },
  ];

  for (const b of brands) {
    await prisma.giftCardRate.create({
      data: {
        brand: b.brand,
        country: b.country,
        cardType: b.cardType,
        ratePercentage: b.rate,
        minAmount: 10.0,
        maxAmount: 1000.0,
        isActive: true,
      },
    });
  }

  console.log('💳 Created default Gift Card rates matrix');

  // 8. Wallet Transactions History
  await prisma.walletTransaction.createMany({
    data: [
      {
        walletId: usdtWallet.id,
        userId: user.id,
        type: 'DEPOSIT',
        amount: 1000.0,
        currency: 'USDT',
        status: 'COMPLETED',
        reference: 'TX-DEP-982134',
        description: 'USDT TRC20 Deposit Confirmed',
        fee: 0.0,
      },
      {
        walletId: usdtWallet.id,
        userId: user.id,
        type: 'GIFT_CARD_PAYOUT',
        amount: 450.75,
        currency: 'USDT',
        status: 'COMPLETED',
        reference: 'TX-GC-551029',
        description: '$500 Apple Gift Card Trade (85% Rate)',
        fee: 0.0,
      },
    ],
  });

  // 9. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: leoUser.id,
        title: 'Welcome Leo Garcia!',
        message: 'Your account has been pre-funded with 3,500 USDT, 0.85 BTC, and 6.5 ETH balances.',
        type: 'SYSTEM',
        isRead: false,
      },
    ],
  });

  // 10. Platform Settings
  await prisma.platformSetting.createMany({
    data: [
      { key: 'MAINTENANCE_MODE', value: 'false', description: 'Platform active status', category: 'SYSTEM' },
      { key: 'MIN_WITHDRAWAL_USDT', value: '20', description: 'Minimum USDT withdrawal limit', category: 'FEES' },
      { key: 'MIN_WITHDRAWAL_BTC', value: '0.001', description: 'Minimum BTC withdrawal limit', category: 'FEES' },
      { key: 'WITHDRAWAL_FEE_USDT', value: '2.5', description: 'Fixed USDT network fee', category: 'FEES' },
      { key: 'WITHDRAWAL_FEE_BTC', value: '0.0002', description: 'Fixed BTC network fee', category: 'FEES' },
      { key: 'KYC_REQUIRED_FOR_WITHDRAWAL', value: 'true', description: 'Require identity verification before payout', category: 'SECURITY' },
    ],
  });

  console.log('✅ OnChaiin Database Seed Completed Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
