import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Box, Button, Typography, Paper } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google.js';

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;

  const handleGoogleSignIn = () => {
    signIn('google', {
      callbackUrl: typeof callbackUrl === 'string' ? callbackUrl : '/dashboard',
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            ログイン
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Googleアカウントでログインしてください
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            fullWidth
            sx={{
              backgroundColor: '#4285f4',
              '&:hover': {
                backgroundColor: '#357ae8',
              },
            }}
          >
            Googleでログイン
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

