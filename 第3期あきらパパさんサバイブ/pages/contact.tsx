import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '名前は必須です';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '有効なメールアドレスを入力してください';
      }
    }

    if (!formData.subject.trim()) {
      newErrors.subject = '件名は必須です';
    }

    if (!formData.message.trim()) {
      newErrors.message = '本文は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // エラーをクリア
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
    setSubmitError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          setSubmitError(data.errors.join(', '));
        } else {
          setSubmitError(data.error || '送信に失敗しました。');
        }
        setIsSubmitting(false);
        return;
      }

      // 送信成功
      router.push({
        pathname: '/contact/success',
        query: { name: formData.name },
      });
    } catch (error) {
      console.error('送信エラー:', error);
      setSubmitError('ネットワークエラーが発生しました。しばらくしてから再度お試しください。');
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          お問合せフォーム
        </Typography>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="お名前"
            name="name"
            value={formData.name}
            onChange={handleChange('name')}
            error={!!errors.name}
            helperText={errors.name}
            margin="normal"
            required
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="メールアドレス"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            error={!!errors.email}
            helperText={errors.email}
            margin="normal"
            required
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="件名"
            name="subject"
            value={formData.subject}
            onChange={handleChange('subject')}
            error={!!errors.subject}
            helperText={errors.subject}
            margin="normal"
            required
            disabled={isSubmitting}
          />

          <TextField
            fullWidth
            label="本文"
            name="message"
            value={formData.message}
            onChange={handleChange('message')}
            error={!!errors.message}
            helperText={errors.message}
            margin="normal"
            required
            multiline
            rows={6}
            disabled={isSubmitting}
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
              disabled={isSubmitting}
              sx={{ minWidth: 200 }}
            >
              {isSubmitting ? '送信中...' : '送信'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}


