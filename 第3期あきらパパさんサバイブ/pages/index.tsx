import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
} from '@mui/material';
import ContactMailIcon from '@mui/icons-material/ContactMail';

export default function HomePage() {
  const router = useRouter();

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 6, textAlign: 'center' }}>
        <ContactMailIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom>
          お問合せフォーム
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
          お問合せは以下のボタンからお進みください。
        </Typography>
        <Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => router.push('/contact')}
            sx={{ minWidth: 200 }}
          >
            お問合せフォームへ
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

