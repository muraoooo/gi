import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
const smtpUser = process.env.SMTP_USER || '';
const smtpPass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || '';
const adminEmail = process.env.ADMIN_EMAIL || '';

if (!smtpUser || !smtpPass || !adminEmail) {
  console.warn('警告: メール送信の環境変数が設定されていません。');
}

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  if (!smtpUser || !smtpPass || !adminEmail) {
    throw new Error('メール送信の設定が不完全です。環境変数を確認してください。');
  }

  const mailOptions = {
    from: `"お問合せフォーム" <${smtpUser}>`,
    to: adminEmail,
    subject: `【お問合せ】${data.subject}`,
    text: `
お問合せフォームから新しい問い合わせが届きました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【お名前】
${data.name}

【メールアドレス】
${data.email}

【件名】
${data.subject}

【本文】
${data.message}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

このメールは自動送信されています。
`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
          お問合せフォームから新しい問い合わせが届きました
        </h2>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin-top: 20px;">
          <p><strong>【お名前】</strong></p>
          <p style="margin-left: 20px;">${data.name}</p>
          
          <p style="margin-top: 15px;"><strong>【メールアドレス】</strong></p>
          <p style="margin-left: 20px;"><a href="mailto:${data.email}">${data.email}</a></p>
          
          <p style="margin-top: 15px;"><strong>【件名】</strong></p>
          <p style="margin-left: 20px;">${data.subject}</p>
          
          <p style="margin-top: 15px;"><strong>【本文】</strong></p>
          <p style="margin-left: 20px; white-space: pre-wrap;">${data.message}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          このメールは自動送信されています。
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export default transporter;

