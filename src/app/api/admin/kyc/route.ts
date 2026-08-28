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

    const docs = await prisma.kYCDocument.findMany({
      include: { user: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = docs.map((d) => ({
      id: d.id,
      userId: d.userId,
      userName: d.user?.name || 'Unknown User',
      userEmail: d.user?.email || 'N/A',
      phone: d.user?.profile?.phone || 'N/A',
      dob: d.user?.profile?.dob || 'N/A',
      address: d.user?.profile?.address || 'N/A',
      city: d.user?.profile?.city || 'N/A',
      country: d.user?.profile?.country || 'N/A',
      idType: d.idType || 'PASSPORT',
      idNumber: d.idNumber || 'N/A',
      frontUrl: d.frontDocumentUrl || '/profile-pic.jpeg',
      backUrl: d.backDocumentUrl || '/profile-pic.jpeg',
      selfieUrl: d.selfieUrl || '/profile-pic.jpeg',
      proofOfAddressUrl: d.proofOfAddressUrl || null,
      status: d.status,
      date: d.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    }));

    return NextResponse.json({ success: true, kycs: formatted });
  } catch (error: any) {
    console.error('Error fetching KYC docs:', error);
    return NextResponse.json({ error: 'Failed to fetch KYC documents' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const currentUser = session?.user as any;
    if (!session || currentUser?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, rejectionReason } = body;

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    const updated = await prisma.kYCDocument.update({
      where: { id },
      data: {
        status,
        ...(rejectionReason && { rejectionReason }),
        reviewedAt: new Date(),
      },
    });

    // Sync kycStatus on user record
    await prisma.user.update({
      where: { id: updated.userId },
      data: { kycStatus: status === 'APPROVED' ? 'APPROVED' : status === 'REJECTED' ? 'REJECTED' : 'PENDING' },
    });

    return NextResponse.json({ success: true, kyc: updated });
  } catch (error: any) {
    console.error('Error updating KYC status:', error);
    return NextResponse.json({ error: 'Failed to update KYC status' }, { status: 500 });
  }
}
