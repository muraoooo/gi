# MVP機能一覧と優先順位

ユーザーニーズに基づき、MVP（Minimum Viable Product）として実装すべき機能を定義し、優先順位を設定する。

## 優先順位の定義
- **P0 (Must have)**: リリースに必須。これがないとサービスとして成立しない。
- **P1 (Should have)**: 重要な機能だが、最悪リリース後の追加でも許容される。
- **P2 (Nice to have)**: あると良いが、今回はスコープ外とする。

## 機能一覧表

| カテゴリ | 機能名 | 詳細 | 優先度 | 実装技術・備考 |
| :--- | :--- | :--- | :--- | :--- |
| **認証** | ユーザー登録・ログイン | Googleアカウントでのログイン機能 | **P0** | NextAuth.js (Google Provider) |
| | ログアウト | ログアウト機能 | **P0** | NextAuth.js |
| **コードレビュー** | コード入力フォーム | ユーザーがレビュー対象のコードを入力するテキストエリア（シンタックスハイライト推奨） | **P0** | MUI, React CodeMirror等 |
| | AIレビュー実行 | Claude Haiku 4.5 APIを呼び出し、コードを解析する | **P0** | Server Actions, Anthropic API |
| | レビュー結果表示 | AIからのフィードバック（修正案、解説）を表示する | **P0** | Markdown表示 (react-markdown等) |
| | ストリーミング表示 | AIの回答をリアルタイムで表示し、体感待ち時間を減らす | **P1** | AI SDK / Vercel AI SDK |
| **履歴管理** | レビュー履歴保存 | 実行したレビュー内容と結果をDBに保存する | **P0** | MongoDB, Mongoose |
| | 履歴一覧表示 | 過去のレビュー履歴をリスト表示する | **P0** | Server Components |
| | 履歴詳細表示 | 過去のレビュー詳細を確認できる | **P0** | Dynamic Routes |
| **その他** | メール通知 | 重要な通知（登録完了など）をメールで送信する | **P2** | Nodemailer |
| | ユーザー設定 | プロフィール情報の編集など | **P2** | |
| | フィードバック評価 | AIの回答に対してGood/Badを評価する | **P2** | |

## MVP開発ロードマップ

### Phase 1: 基盤構築 (Day 1-2)
- Next.js 15 プロジェクトセットアップ
- MongoDB 接続設定 (Mongoose)
- NextAuth.js による認証実装
- MUI テーマ設定

### Phase 2: コア機能実装 (Day 3-5)
- コード入力画面の作成
- Claude API 連携処理の実装
- レビュー結果の表示コンポーネント作成
- データベーススキーマ設計（User, Review）

### Phase 3: 履歴機能・UI調整 (Day 6-7)
- レビュー履歴の保存処理
- 履歴一覧・詳細ページの作成
- 全体のUI/UXブラッシュアップ
- デプロイ・動作確認

## 技術スタック詳細
- **Frontend**: Next.js 15 (App Router), React, MUI (Material UI)
- **Backend**: Next.js Server Actions
- **Database**: MongoDB (Atlas), Mongoose
- **Auth**: NextAuth.js v5
- **AI**: Anthropic Claude 3 Haiku (via API)
- **Mail**: Nodemailer (MVPでは優先度低、P2)
