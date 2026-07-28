import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const doc = await prisma.kYCDocument.findFirst({
      where: { userId: session.user.id as string },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ kyc: doc });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch KYC document' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { idType, idNumber, frontDocumentUrl, selfieUrl } = await req.json();
    const userId = session.user.id as string;

    const kyc = await prisma.kYCDocument.create({
      data: {
        userId,
        idType,
        idNumber,
        frontDocumentUrl,
        selfieUrl,
        status: 'PENDING',
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { kycStatus: 'PENDING' },
    });

    return NextResponse.json({ success: true, kyc });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to submit KYC' }, { status: 500 });
  }
}
