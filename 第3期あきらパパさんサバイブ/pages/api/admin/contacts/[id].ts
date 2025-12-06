import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../../lib/admin';
import connectDB from '../../../../lib/mongodb';
import Contact from '../../../../models/Contact';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 管理者権限チェック
  const admin = await checkAdminAuth(req, res);
  if (!admin) {
    return; // checkAdminAuth内でレスポンスを返している
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'お問合せIDが必要です' });
  }

  if (req.method === 'GET') {
    try {
      await connectDB();

      const contact = await Contact.findById(id).lean();

      if (!contact) {
        return res.status(404).json({ error: 'お問合せが見つかりません' });
      }

      return res.status(200).json({
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
        createdAt: contact.createdAt,
      });
    } catch (error) {
      console.error('お問合せ詳細取得エラー:', error);
      return res.status(500).json({ error: 'お問合せ詳細の取得に失敗しました' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await connectDB();

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ error: 'お問合せが見つかりません' });
      }

      await Contact.findByIdAndDelete(id);

      return res.status(200).json({ message: 'お問合せを削除しました' });
    } catch (error) {
      console.error('お問合せ削除エラー:', error);
      return res.status(500).json({ error: 'お問合せの削除に失敗しました' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}



