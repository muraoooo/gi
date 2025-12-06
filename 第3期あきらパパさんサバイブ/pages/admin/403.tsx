import { Container, Box, Typography, Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import LockIcon from '@mui/icons-material/Lock.js';
import HomeIcon from '@mui/icons-material/Home.js';

export default function Forbidden() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', width: '100%' }}>
          <LockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="error">
            アクセス拒否
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            403 Forbidden
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            このページにアクセスするには管理者権限が必要です。
            <br />
            一般ユーザーはこのページにアクセスできません。
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            sx={{ mt: 2 }}
          >
            ホームに戻る
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}



