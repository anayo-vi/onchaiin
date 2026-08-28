import { verifyAdminSession } from '@/lib/adminAuth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const admin = await verifyAdminSession();
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const logs = await prisma.adminAuditLog.findMany({
      include: { admin: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    const formatted = logs.map((l) => ({
      id: l.id,
      adminName: l.admin?.name || 'System Admin',
      adminEmail: l.admin?.email || 'admin@onchaiin.com',
      action: l.action,
      resource: l.targetResource,
      targetId: l.targetId || 'N/A',
      ipAddress: l.ipAddress || '127.0.0.1',
      date: l.createdAt.toISOString().replace('T', ' ').substring(0, 16),
    }));

    return NextResponse.json({ success: true, logs: formatted });
  } catch (error: any) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}
