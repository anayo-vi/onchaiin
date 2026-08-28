import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * Verify that the current session user is an ADMIN.
 * Looks up the role directly from PostgreSQL to avoid stale JWT issues.
 * Returns the DB user record on success, or null on failure.
 */
export async function verifyAdminSession(): Promise<{ id: string; email: string; role: string } | null> {
  try {
    const session = await auth();
    if (!session?.user) return null;

    const sessionId = (session.user as any).id;
    const sessionEmail = session.user.email;

    let caller: { id: string; email: string; role: string } | null = null;

    if (sessionId) {
      caller = await prisma.user.findUnique({
        where: { id: sessionId },
        select: { id: true, email: true, role: true },
      });
    }

    if (!caller && sessionEmail) {
      caller = await prisma.user.findUnique({
        where: { email: sessionEmail },
        select: { id: true, email: true, role: true },
      });
    }

    if (!caller || caller.role !== 'ADMIN') {
      console.warn(`[verifyAdmin] Rejected — email: ${sessionEmail}, role: ${caller?.role ?? 'none'}`);
      return null;
    }

    return caller;
  } catch (err) {
    console.error('[verifyAdmin] Error:', err);
    return null;
  }
}
