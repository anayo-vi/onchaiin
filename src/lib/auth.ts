import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email or Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter both your username/email and password.');
        }

        const inputIdentifier = String(credentials.email).toLowerCase().trim();
        const password = String(credentials.password);

        // Support full email or simple username (e.g. leogarcia39 -> leogarcia39@onchaiin.com)
        const emailToSearch = inputIdentifier.includes('@')
          ? inputIdentifier
          : `${inputIdentifier}@onchaiin.com`;

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: emailToSearch },
              { email: inputIdentifier },
            ],
          },
        });

        // Detailed error logging: User not found
        if (!user || !user.passwordHash) {
          throw new Error('User not found. Please check your username or email address.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        // Detailed error logging: Incorrect password
        if (!isPasswordValid) {
          throw new Error('Incorrect password. Please verify your password and try again.');
        }

        // Account status check
        if (user.isFrozen) {
          throw new Error('Your account has been frozen by administration. Please contact support.');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || 'User',
          role: user.role,
          avatar: user.avatar,
          kycStatus: user.kycStatus,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'USER';
        let av = (user as any).avatar || '/profile-pic.jpeg';
        if (typeof av === 'string' && av.startsWith('data:image')) av = '/profile-pic.jpeg';
        token.avatar = av;
        token.kycStatus = (user as any).kycStatus || 'UNVERIFIED';
      }
      if (trigger === 'update' && session) {
        token.name = session.name || token.name;
        if (session.avatar && typeof session.avatar === 'string' && !session.avatar.startsWith('data:image')) {
          token.avatar = session.avatar;
        }
        token.kycStatus = session.kycStatus || token.kycStatus;
      }
      if (token.avatar && typeof token.avatar === 'string' && token.avatar.startsWith('data:image')) {
        token.avatar = '/profile-pic.jpeg';
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).avatar = token.avatar as string;
        (session.user as any).kycStatus = token.kycStatus as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'onchaiin_super_secret_jwt_key_32_characters_minimum_length_prod',
});
