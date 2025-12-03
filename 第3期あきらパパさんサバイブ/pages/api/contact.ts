import type { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { sendContactEmail } from '@/lib/mailer';

interface ContactRequestBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // リクエストボディの取得
    const { name, email, subject, message }: ContactRequestBody = req.body;

    // バリデーション
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      errors.push('名前は必須です');
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      errors.push('メールアドレスは必須です');
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        errors.push('有効なメールアドレスを入力してください');
      }
    }

    if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
      errors.push('件名は必須です');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      errors.push('本文は必須です');
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // データベース接続
    await connectDB();

    // MongoDBに保存
    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    });

    await contact.save();

    // メール送信
    try {
      await sendContactEmail({
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        message: contact.message,
      });
    } catch (mailError) {
      console.error('メール送信エラー:', mailError);
      // メール送信に失敗しても、DB保存は成功しているので、エラーをログに記録するが、レスポンスは成功を返す
      // 本番環境では、メール送信失敗を別途通知する仕組みを検討する
    }

    return res.status(200).json({
      success: true,
      message: 'お問合せを受け付けました。ありがとうございます。',
    });
  } catch (error) {
    console.error('APIエラー:', error);
    console.error('エラー詳細:', error instanceof Error ? error.message : String(error));
    console.error('エラースタック:', error instanceof Error ? error.stack : 'スタック情報なし');
    return res.status(500).json({
      error: 'サーバーエラーが発生しました。しばらくしてから再度お試しください。',
      details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined,
    });
  }
}

