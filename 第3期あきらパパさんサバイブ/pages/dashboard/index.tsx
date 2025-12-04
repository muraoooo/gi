import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <Container maxWidth="md">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ダッシュボード
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          ようこそ、{session.user?.name || 'ユーザー'}さん
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            ユーザー情報
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>名前:</strong> {session.user?.name || '未設定'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>メールアドレス:</strong> {session.user?.email || '未設定'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>権限:</strong> {session.user?.role || 'user'}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

