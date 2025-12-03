# お問合せフォーム機能

Next.js + MongoDB + Nodemailer を使用したお問合せフォームアプリケーションです。

## 機能

- お問合せフォーム画面（名前、メールアドレス、件名、本文）
- 入力バリデーション（必須チェック、メール形式チェック）
- Nodemailerで管理者へメール送信
- 送信完了画面表示
- MongoDBにお問合せ内容を保存

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local.example`をコピーして`.env.local`を作成し、以下の環境変数を設定してください。

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集：

```
MONGODB_URI=mongodb://localhost:27017/contact-form-db
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@example.com
```

### 3. MongoDBの起動

MongoDBがインストールされ、起動していることを確認してください。

```bash
# MongoDBが起動しているか確認
mongosh
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000/contact](http://localhost:3000/contact) にアクセスしてください。

## ファイル構成

```
プロジェクトルート/
├── pages/
│   ├── contact.tsx          # お問合せフォーム画面
│   ├── contact/
│   │   └── success.tsx      # 送信完了画面
│   ├── api/
│   │   └── contact.ts        # お問合せAPI
│   └── _app.tsx             # アプリケーション設定
├── models/
│   └── Contact.ts            # Contactモデル（Mongoose）
├── lib/
│   ├── mongodb.ts            # MongoDB接続設定
│   └── mailer.ts             # Nodemailer設定
├── .env.local                # 環境変数（gitignoreに含まれています）
└── package.json
```

## 技術スタック

- **フレームワーク**: Next.js 14
- **UIライブラリ**: Material-UI (MUI) 5
- **データベース**: MongoDB
- **ODM**: Mongoose
- **メール送信**: Nodemailer
- **言語**: TypeScript

## 使用方法

1. `/contact`ページにアクセス
2. フォームに必要事項を入力
3. 「送信」ボタンをクリック
4. バリデーションが通ると、データベースに保存され、管理者にメールが送信されます
5. 送信完了画面が表示されます

## 注意事項

- Gmailを使用する場合、アプリパスワードの設定が必要です
- MongoDBが起動していることを確認してください
- 環境変数が正しく設定されていることを確認してください

