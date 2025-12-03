import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SendIcon from '@mui/icons-material/Send';
import InfoIcon from '@mui/icons-material/Info';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <ContactMailIcon sx={{ fontSize: 100, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          お問合せフォーム
        </Typography>
        <Typography variant="h6" sx={{ mb: 4, color: 'text.secondary' }}>
          ご質問やお問い合わせがございましたら、お気軽にご連絡ください
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<SendIcon />}
          onClick={() => router.push('/contact')}
          sx={{ minWidth: 250, py: 1.5, fontSize: '1.1rem' }}
        >
          お問合せフォームへ
        </Button>
      </Box>

      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <InfoIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                簡単入力
              </Typography>
              <Typography variant="body2" color="text.secondary">
                お名前、メールアドレス、件名、本文を入力するだけで、簡単にお問い合わせできます。
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/contact')}>
                フォームへ
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <SendIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                即座に送信
              </Typography>
              <Typography variant="body2" color="text.secondary">
                送信ボタンをクリックすると、すぐに管理者にメールが送信され、データベースに保存されます。
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/contact')}>
                フォームへ
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <ContactMailIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" component="h2" gutterBottom>
                迅速な対応
              </Typography>
              <Typography variant="body2" color="text.secondary">
                お問い合わせ内容を確認次第、迅速にご連絡いたします。お気軽にご利用ください。
              </Typography>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => router.push('/contact')}>
                フォームへ
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

