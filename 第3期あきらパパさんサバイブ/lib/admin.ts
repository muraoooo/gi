import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * 管理者権限チェック関数（API Route用）
 * @param req NextApiRequest
 * @param res NextApiResponse
 * @returns 管理者セッション情報、またはnull（権限なし）
 */
export async function checkAdminAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ id: string; email: string; role: string } | null> {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).json({ error: '認証が必要です' });
    return null;
  }

  if (session.user?.role !== 'admin') {
    res.status(403).json({ error: '管理者権限が必要です' });
    return null;
  }

  return {
    id: session.user.id || '',
    email: session.user.email || '',
    role: session.user.role || 'user',
  };
}



