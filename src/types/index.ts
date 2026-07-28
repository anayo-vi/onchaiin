export type UserRole = 'USER' | 'ADMIN';
export type KYCStatus = 'UNVERIFIED' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type CryptoCurrency = 'BTC' | 'ETH' | 'USDT' | 'TRX' | 'LTC';
export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'GIFT_CARD_PAYOUT' | 'CREDIT' | 'DEBIT' | 'ADJUSTMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type DepositStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';
export type WithdrawalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSING' | 'COMPLETED';
export type GiftCardStatus = 'PENDING' | 'PROCESSING' | 'APPROVED' | 'REJECTED';
export type CardType = 'PHYSICAL' | 'ECODE';
export type NotificationType = 'SYSTEM' | 'TRANSACTION' | 'GIFT_CARD' | 'SECURITY' | 'KYC';

export interface UserSession {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  avatar: string | null;
  kycStatus: KYCStatus;
  isFrozen: boolean;
}

export interface WalletBalance {
  id: string;
  currency: CryptoCurrency;
  balance: number;
  pendingBalance: number;
  address: string;
  usdValue: number;
}

export interface CryptoPrice {
  symbol: CryptoCurrency;
  name: string;
  priceUsd: number;
  change24h: number;
  icon: string;
}

export interface WalletTransactionItem {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CryptoCurrency;
  status: TransactionStatus;
  reference: string;
  description: string | null;
  fee: number;
  createdAt: string;
}

export interface GiftCardBrand {
  id: string;
  name: string;
  logo: string;
  countries: string[];
}

export interface GiftCardRateItem {
  id: string;
  brand: string;
  country: string;
  cardType: CardType;
  ratePercentage: number;
  minAmount: number;
  maxAmount: number;
  isActive: boolean;
}

export interface GiftCardSubmissionItem {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  brand: string;
  country: string;
  cardType: CardType;
  denomination: number;
  ratePercentage: number;
  calculatedPayout: number;
  frontImageUrl: string | null;
  backImageUrl: string | null;
  cardCode: string | null;
  pin: string | null;
  status: GiftCardStatus;
  rejectionReason: string | null;
  adminNotes: string | null;
  createdAt: string;
}

export interface KYCDocumentItem {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  idType: string;
  idNumber: string;
  frontDocumentUrl: string;
  backDocumentUrl: string | null;
  selfieUrl: string;
  proofOfAddressUrl: string | null;
  status: KYCStatus;
  rejectionReason: string | null;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link: string | null;
  createdAt: string;
}

export interface AdminDashboardMetrics {
  totalUsers: number;
  totalVolumeUsd: number;
  pendingGiftCards: number;
  pendingWithdrawals: number;
  pendingKYC: number;
  totalRevenueUsd: number;
}
