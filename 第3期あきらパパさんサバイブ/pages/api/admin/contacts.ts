import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../lib/admin';
import connectDB from '../../../lib/mongodb';
import Contact from '../../../models/Contact';

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

      const contacts = await Contact.find({})
        .select('name email subject message createdAt')
        .sort({ createdAt: -1 })
        .lean();

      return res.status(200).json(
        contacts.map((contact) => ({
          id: contact._id.toString(),
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message,
          createdAt: contact.createdAt,
        }))
      );
    } catch (error) {
      console.error('お問合せ一覧取得エラー:', error);
      return res.status(500).json({ error: 'お問合せ一覧の取得に失敗しました' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}



