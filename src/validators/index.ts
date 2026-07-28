import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  bio: z.string().optional(),
});

export const withdrawalSchema = z.object({
  currency: z.enum(['BTC', 'ETH', 'USDT', 'TRX', 'LTC']),
  amount: z.number().positive('Amount must be greater than 0'),
  destinationAddress: z.string().min(10, 'Please enter a valid wallet address'),
});

export const depositSchema = z.object({
  currency: z.enum(['BTC', 'ETH', 'USDT', 'TRX', 'LTC']),
  amount: z.number().positive('Amount must be greater than 0'),
});

export const giftCardSubmissionSchema = z.object({
  brand: z.string().min(1, 'Please select a brand'),
  country: z.string().min(1, 'Please select a country'),
  cardType: z.enum(['PHYSICAL', 'ECODE']),
  denomination: z.number().positive('Denomination must be greater than 0'),
  cardCode: z.string().optional(),
  pin: z.string().optional(),
  frontImageUrl: z.string().optional(),
  backImageUrl: z.string().optional(),
});

export const kycSubmissionSchema = z.object({
  idType: z.enum(['PASSPORT', 'DRIVERS_LICENSE', 'NATIONAL_ID']),
  idNumber: z.string().min(3, 'Please enter ID document number'),
  frontDocumentUrl: z.string().url('Please provide front document image'),
  backDocumentUrl: z.string().optional(),
  selfieUrl: z.string().url('Please provide selfie image'),
  proofOfAddressUrl: z.string().optional(),
});

export const rateConfigSchema = z.object({
  brand: z.string(),
  country: z.string(),
  cardType: z.enum(['PHYSICAL', 'ECODE']),
  ratePercentage: z.number().min(1).max(100),
  minAmount: z.number().min(1),
  maxAmount: z.number().min(10),
  isActive: z.boolean(),
});
