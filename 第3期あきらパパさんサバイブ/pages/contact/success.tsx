import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';

export default function ContactSuccessPage() {
  const router = useRouter();
  const { name } = router.query;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon
            sx={{
              fontSize: 80,
              color: 'success.main',
              mb: 2,
            }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            送信完了
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
            {name && typeof name === 'string' ? (
              <>
                {name}様、お問合せありがとうございました。
                <br />
                内容を確認次第、ご連絡いたします。
              </>
            ) : (
              <>
                お問合せを受け付けました。
                <br />
                内容を確認次第、ご連絡いたします。
              </>
            )}
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => router.push('/')}
            size="large"
          >
            ホームに戻る
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}


