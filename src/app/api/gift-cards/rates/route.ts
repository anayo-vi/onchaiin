import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const rates = await prisma.giftCardRate.findMany({
      where: { isActive: true },
      orderBy: { brand: 'asc' },
    });

    return NextResponse.json({ rates });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch rates' }, { status: 500 });
  }
}
