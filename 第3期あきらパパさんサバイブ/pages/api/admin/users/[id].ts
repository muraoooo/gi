import type { NextApiRequest, NextApiResponse } from 'next';
import { checkAdminAuth } from '../../../../lib/admin';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

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
    return res.status(400).json({ error: 'ユーザーIDが必要です' });
  }

  if (req.method === 'PUT') {
    try {
      await connectDB();

      const { role } = req.body;

      if (!role || (role !== 'user' && role !== 'admin')) {
        return res.status(400).json({ error: '有効な権限を指定してください' });
      }

      // 自分自身の権限を変更しようとした場合は拒否
      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      // 自分自身の権限を変更しようとした場合は拒否（オプション）
      // if (targetUser.email === admin.email && role !== 'admin') {
      //   return res.status(400).json({ error: '自分の管理者権限を削除することはできません' });
      // }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role, updatedAt: new Date() },
        { new: true }
      )
        .select('name email role createdAt updatedAt')
        .lean();

      if (!updatedUser) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      return res.status(200).json({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      });
    } catch (error) {
      console.error('ユーザー更新エラー:', error);
      return res.status(500).json({ error: 'ユーザーの更新に失敗しました' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await connectDB();

      const targetUser = await User.findById(id);
      if (!targetUser) {
        return res.status(404).json({ error: 'ユーザーが見つかりません' });
      }

      // 自分自身を削除しようとした場合は拒否
      if (targetUser.email === admin.email) {
        return res.status(400).json({ error: '自分自身を削除することはできません' });
      }

      await User.findByIdAndDelete(id);

      return res.status(200).json({ message: 'ユーザーを削除しました' });
    } catch (error) {
      console.error('ユーザー削除エラー:', error);
      return res.status(500).json({ error: 'ユーザーの削除に失敗しました' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}



