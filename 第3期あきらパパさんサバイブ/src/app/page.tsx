'use client';

import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Stack,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Code as CodeIcon,
  Speed as SpeedIcon,
  School as SchoolIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  GitHub as GitHubIcon,
  Twitter as TwitterIcon,
} from '@mui/icons-material';

// Create a dark theme with a premium feel
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6', // Bright Blue
    },
    secondary: {
      main: '#ec4899', // Pink
    },
    background: {
      default: '#0a0a0a',
      paper: '#171717',
    },
    text: {
      primary: '#ededed',
      secondary: '#a1a1aa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontWeight: 700,
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3b82f6 30%, #2563eb 90%)',
          boxShadow: '0 3px 5px 2px rgba(59, 130, 246, .3)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          backgroundImage: 'none',
          backgroundColor: '#1e1e1e',
          border: '1px solid #333',
        },
      },
    },
  },
});

export default function LandingPage() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Header */}
        <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Container maxWidth="lg">
            <Toolbar disableGutters>
              <CodeIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: 'primary.main' }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: { xs: 'none', md: 'flex' },
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                AI Code Review
              </Typography>

              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2, ml: 4 }}>
                <Button color="inherit" href="#features">特徴</Button>
                <Button color="inherit" href="#how-to">使い方</Button>
              </Box>

              <Box sx={{ flexGrow: 0 }}>
                <Button color="inherit" sx={{ mr: 1 }}>ログイン</Button>
                <Button variant="contained" color="primary">登録する</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        {/* Hero Section */}
        <Box
          sx={{
            pt: 15,
            pb: 10,
            background: 'radial-gradient(circle at 50% 50%, #1a1a1a 0%, #0a0a0a 100%)',
            textAlign: 'center',
          }}
        >
          <Container maxWidth="md">
            <Chip label="Claude Haiku 4.5 搭載" color="secondary" size="small" sx={{ mb: 2 }} />
            <Typography variant="h1" gutterBottom sx={{ background: 'linear-gradient(90deg, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              あなたのコードが、<br />もっと輝く。
            </Typography>
            <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
              プログラミング学習中のあなたに。<br />
              AIが24時間365日、あなたのコードを優しく、的確にレビューします。
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />}>
                無料でレビューを試す
              </Button>
              <Button variant="outlined" size="large" color="inherit">
                デモを見る
              </Button>
            </Stack>
          </Container>
        </Box>

        {/* Features Section */}
        <Container id="features" sx={{ py: 10 }}>
          <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
            選ばれる3つの理由
          </Typography>
          <Grid container spacing={4}>
            {[
              {
                icon: <SpeedIcon fontSize="large" color="primary" />,
                title: '高速・高精度なAIレビュー',
                desc: 'Claude Haiku 4.5を採用。待ち時間なしで、実務レベルの的確なフィードバックを提供します。',
              },
              {
                icon: <SchoolIcon fontSize="large" color="secondary" />,
                title: '初心者にも優しい解説',
                desc: '単なる正誤判定ではありません。「なぜ良いのか」「どう直すべきか」を丁寧に解説し、学習をサポートします。',
              },
              {
                icon: <CheckCircleIcon fontSize="large" color="success" />,
                title: '成長の可視化',
                desc: '過去のレビュー履歴を自動保存。自分のスキルアップを時系列で確認し、自信につなげることができます。',
              },
            ].map((feature, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
                  <CardContent>
                    <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                    <Typography gutterBottom variant="h5" component="div">
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* How to Use Section */}
        <Box sx={{ bgcolor: 'background.paper', py: 10 }} id="how-to">
          <Container>
            <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
              使い方は簡単
            </Typography>
            <Grid container spacing={4} justifyContent="center">
              {[
                { step: '01', title: 'コードを入力', desc: 'レビューしてほしいコードをエディタに入力または貼り付けます。' },
                { step: '02', title: 'レビュー実行', desc: 'ボタンをワンクリック。数秒でAIが解析を開始します。' },
                { step: '03', title: 'フィードバック', desc: '改善点やアドバイスを確認し、コードを修正して学習完了！' },
              ].map((item, index) => (
                <Grid size={{ xs: 12, md: 4 }} key={index}>
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Typography variant="h1" color="rgba(255,255,255,0.1)" sx={{ fontSize: '6rem', fontWeight: 900, lineHeight: 1, mb: -4 }}>
                      {item.step}
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ position: 'relative', zIndex: 1, fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Bottom CTA */}
        <Box sx={{ py: 10, textAlign: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #111 100%)' }}>
          <Container maxWidth="sm">
            <Typography variant="h3" gutterBottom>
              独学の不安を、自信に変えよう。
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
              今すぐ無料で始めて、プログラミングスキルを次のレベルへ。
            </Typography>
            <Button variant="contained" size="large" fullWidth sx={{ py: 2, fontSize: '1.2rem' }}>
              今すぐ始める（無料）
            </Button>
          </Container>
        </Box>

        {/* Footer */}
        <Box sx={{ py: 4, borderTop: '1px solid rgba(255,255,255,0.1)', mt: 'auto' }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="space-between" alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <Typography variant="h6" color="text.primary" gutterBottom>
                  AI Code Review
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  © 2025 AI Code Review. All rights reserved.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                  <Button 
                    color="inherit" 
                    size="small" 
                    href="/terms" 
                    sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                  >
                    利用規約
                  </Button>
                  <Button 
                    color="inherit" 
                    size="small" 
                    href="/privacy" 
                    sx={{ textTransform: 'none', fontSize: '0.875rem' }}
                  >
                    プライバシーポリシー
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 2 }}>
                <Button
                  component="a"
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ minWidth: 'auto', p: 1 }}
                  aria-label="GitHub"
                >
                  <GitHubIcon color="action" />
                </Button>
                <Button
                  component="a"
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ minWidth: 'auto', p: 1 }}
                  aria-label="Twitter"
                >
                  <TwitterIcon color="action" />
                </Button>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
