import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail.js';
import HomeIcon from '@mui/icons-material/Home.js';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function Navigation() {
  const router = useRouter();

  // LP（ホームページ）では共通ナビゲーションを表示しない
  if (router.pathname === '/') {
    return null;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          お問合せフォームアプリ
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
          >
            ホーム
          </Button>
          <Button
            color="inherit"
            startIcon={<ContactMailIcon />}
            onClick={() => router.push('/contact')}
          >
            お問合せ
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
