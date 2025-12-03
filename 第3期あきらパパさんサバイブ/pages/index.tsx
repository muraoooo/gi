import React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Link,
  Stack,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle.js';
import SchoolIcon from '@mui/icons-material/School.js';
import TrendingUpIcon from '@mui/icons-material/TrendingUp.js';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward.js';

// LP用のダークテーマ
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // ブルー
    },
    background: {
      default: '#0f1115', // かなり暗いグレー/黒
      paper: '#181b21',   // カードなどの背景
    },
    text: {
      primary: '#ffffff',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
  },
});

export default function LandingPage() {
  const router = useRouter();

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* ヘッダー */}
        <AppBar position="static" sx={{ py: 1 }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ mr: 1 }}>&lt;&gt;</Box> AI Code Review
              </Typography>
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3, alignItems: 'center' }}>
                <Link href="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}>特徴</Link>
                <Link href="#" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}>使い方</Link>
                <Link href="/contact" color="text.secondary" underline="none" sx={{ '&:hover': { color: 'primary.main' } }}>お問い合わせ</Link>
                <Button color="inherit">ログイン</Button>
                <Button variant="contained" color="primary">登録する</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* ヒーローセクション */}
        <Box sx={{ 
          py: { xs: 8, md: 12 }, 
          textAlign: 'center',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, rgba(15, 17, 21, 0) 50%)',
        }}>
          <Container maxWidth="md">
            <Box sx={{ mb: 2, display: 'inline-block', px: 2, py: 0.5, borderRadius: 99, bgcolor: 'rgba(59, 130, 246, 0.1)', color: 'primary.main', fontSize: '0.875rem', fontWeight: 'medium' }}>
              Claude Haiku 4.5 搭載
            </Box>
            <Typography variant="h2" component="h1" sx={{ mb: 3, fontSize: { xs: '2.5rem', md: '3.75rem' }, lineHeight: 1.2 }}>
              あなたのコードが、<br />
              <Box component="span" sx={{ color: 'primary.main' }}>もっと輝く。</Box>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 5, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}>
              プログラミング学習中のあなたに。<br />
              AIが24時間365日、あなたのコードを優しく、的確にレビューします。
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button variant="contained" size="large" sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
                無料でレビューを試す <ArrowForwardIcon sx={{ ml: 1, fontSize: 20 }} />
              </Button>
              <Button variant="outlined" size="large" sx={{ px: 4, py: 1.5, fontSize: '1.1rem', borderColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                デモを見る
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* 選ばれる3つの理由 */}
        <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#0f1115' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
              選ばれる3つの理由
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  icon: <CheckCircleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
                  title: '高速・高精度なAIレビュー',
                  description: 'Claude Haiku 4.5を採用。待ち時間なしで、実務レベルの的確なフィードバックを提供します。'
                },
                {
                  icon: <SchoolIcon sx={{ fontSize: 40, color: '#10b981' }} />, // Green
                  title: '初心者にも優しい解説',
                  description: '単なる正誤判定ではありません。「なぜ良いのか」「どう直すべきか」を丁寧に解説し、学習をサポートします。'
                },
                {
                  icon: <TrendingUpIcon sx={{ fontSize: 40, color: '#f59e0b' }} />, // Amber
                  title: '成長の可視化',
                  description: '過去のレビュー履歴を自動保存。自分のスキルアップを時系列で確認し、自信につなげることができます。'
                }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.05)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardContent sx={{ p: 4 }}>
                      <Box sx={{ mb: 2 }}>{item.icon}</Box>
                      <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        {item.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* 使い方は簡単 */}
        <Box sx={{ py: { xs: 8, md: 10 } }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" align="center" sx={{ mb: 8, fontWeight: 'bold' }}>
              使い方は簡単
            </Typography>
            <Grid container spacing={4}>
              {[
                { step: '01', title: 'コードを入力', desc: 'レビューしてほしいコードをエディタに入力または貼り付けます。' },
                { step: '02', title: 'レビュー実行', desc: 'ボタンをワンクリック。数秒でAIが解析を開始します。' },
                { step: '03', title: 'フィードバック', desc: '改善点やアドバイスを確認し、コードを修正して学習完了！' }
              ].map((item, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Box sx={{ textAlign: 'center', px: 2 }}>
                    <Typography variant="h2" sx={{ color: 'rgba(255,255,255,0.1)', fontWeight: 'bold', mb: -3, position: 'relative', zIndex: 0 }}>
                      {item.step}
                    </Typography>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* CTAセクション */}
        <Box sx={{ py: { xs: 8, md: 10 }, textAlign: 'center', bgcolor: 'background.paper' }}>
          <Container maxWidth="md">
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
              独学の不安を、自信に変えよう。
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              今すぐ無料で始めて、プログラミングスキルを次のレベルへ。
            </Typography>
            <Button variant="contained" size="large" sx={{ px: 6, py: 1.5, fontSize: '1.1rem' }}>
              今すぐ始める（無料）
            </Button>
            <Box sx={{ mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                ご不明点がありますか？ 
                <Link href="/contact" sx={{ ml: 1, color: 'primary.main', cursor: 'pointer' }}>
                  お問い合わせはこちら
                </Link>
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* フッター */}
        <Box sx={{ py: 4, bgcolor: '#0f1115', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                AI Code Review
              </Typography>
              <Stack direction="row" spacing={3}>
                <Link href="#" color="text.secondary" underline="hover" variant="body2">利用規約</Link>
                <Link href="#" color="text.secondary" underline="hover" variant="body2">プライバシーポリシー</Link>
                <Link href="/contact" color="text.secondary" underline="hover" variant="body2">お問い合わせ</Link>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                © 2025 AI Code Review. All rights reserved.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
