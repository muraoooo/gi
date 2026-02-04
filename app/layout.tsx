import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: '医療法人Gi | 人生の完治コンパス',
  description: 'あなたに最適な「完治のカタチ」を提案する診断アプリ',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Gi診断',
  },
}

export const viewport: Viewport = {
  themeColor: '#00429d',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
