import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../lib/admin';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 管理者権限チェック
  const admin = await checkAdminAuth(req, res);
  if (!admin) {
    return; // checkAdminAuth内でレスポンスを返している
  }

  if (req.method === 'GET') {
    try {
      await connectDB();

      const users = await User.find({})
        .select('name email role createdAt updatedAt')
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json(
        users.map((user) => ({
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }))
      );
    } catch (error) {
      console.error('ユーザー一覧取得エラー:', error);
      return res.status(500).json({ error: 'ユーザー一覧の取得に失敗しました' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}



