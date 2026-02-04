# 医療法人Gi | 人生の完治コンパス

PWA（Progressive Web App）化された診断アプリです。

## 機能

- 📱 モバイルアプリとしてインストール可能
- 🔄 オフライン対応（Service Worker）
- 📲 ホーム画面に追加可能
- 🎨 レスポンシブデザイン

## アイコンの生成方法

PWAとして完全に機能させるには、以下のサイズのアイコン画像が必要です：

- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)

`icon.svg`をベースに、以下のコマンドで生成できます：

```bash
# ImageMagickを使用する場合
convert -background none icon.svg -resize 192x192 icon-192.png
convert -background none icon.svg -resize 512x512 icon-512.png
```

または、オンラインツール（例: https://realfavicongenerator.net/）を使用して生成することもできます。

## デプロイ

Vercelなどのホスティングサービスにデプロイすると、自動的にPWAとして動作します。

## インストール方法

### iOS (Safari)
1. Safariでサイトを開く
2. 共有ボタン（□↑）をタップ
3. 「ホーム画面に追加」を選択

### Android (Chrome)
1. Chromeでサイトを開く
2. メニュー（⋮）をタップ
3. 「ホーム画面に追加」を選択

### デスクトップ (Chrome/Edge)
1. アドレスバーのインストールアイコンをクリック
2. 「インストール」をクリック
