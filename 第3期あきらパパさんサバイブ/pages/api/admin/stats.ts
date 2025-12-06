import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../lib/admin';
import connectDB from '../../../lib/mongodb';
import User from '../../../models/User';
import Contact from '../../../models/Contact';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 管理者権限チェック
  const admin = await checkAdminAuth(req, res);
  if (!admin) {
    return; // checkAdminAuth内でレスポンスを返している
  }

  try {
    await connectDB();

    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();

    return res.status(200).json({
      totalUsers,
      totalContacts,
    });
  } catch (error) {
    console.error('統計情報取得エラー:', error);
    return res.status(500).json({ error: '統計情報の取得に失敗しました' });
  }
}



