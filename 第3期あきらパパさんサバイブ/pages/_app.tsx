import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useRouter } from 'next/router';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail.js';
import HomeIcon from '@mui/icons-material/Home.js';
import DashboardIcon from '@mui/icons-material/Dashboard.js';
import LogoutIcon from '@mui/icons-material/Logout.js';
import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

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
  const { data: session, status } = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await signOut({ callbackUrl: '/' });
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          お問合せフォームアプリ
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
          {status === 'loading' ? null : session ? (
            <>
              <Button
                color="inherit"
                startIcon={<DashboardIcon />}
                onClick={() => router.push('/dashboard')}
              >
                ダッシュボード
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 1 }}>
                <Avatar
                  src={session.user?.image || undefined}
                  alt={session.user?.name || 'User'}
                  sx={{ width: 32, height: 32, cursor: 'pointer' }}
                  onClick={handleMenuClick}
                />
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem disabled>
                    <Typography variant="body2">
                      {session.user?.name || 'ユーザー'}
                    </Typography>
                  </MenuItem>
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {session.user?.email}
                    </Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    ログアウト
                  </MenuItem>
                </Menu>
              </Box>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => router.push('/auth/signin')}
            >
              ログイン
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isLandingPage = router.pathname === '/';

  if (isLandingPage) {
    return (
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navigation />
        <Component {...pageProps} />
      </ThemeProvider>
    </SessionProvider>
  );
}
