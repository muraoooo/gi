import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People.js';
import ContactMailIcon from '@mui/icons-material/ContactMail.js';
import RefreshIcon from '@mui/icons-material/Refresh.js';

interface Stats {
  totalUsers: number;
  totalContacts: number;
}

export default function AdminDashboard() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    // デバッグ用ログ
    console.log('AdminDashboard - status:', status);
    console.log('AdminDashboard - session:', session);
    console.log('AdminDashboard - role:', session?.user?.role);

    const debugMsg = `Status: ${status}, Role: ${session?.user?.role || 'undefined'}, Email: ${session?.user?.email || 'undefined'}`;
    setDebugInfo(debugMsg);

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin');
      return;
    }

    if (status === 'authenticated') {
      // セッションを再取得して最新のroleを取得
      if (session.user?.role !== 'admin') {
        console.log('Not admin, redirecting to 403');
        router.push('/admin/403');
        return;
      }

      // 管理者の場合、統計情報を取得
      console.log('Admin user detected, fetching stats');
      fetchStats();
    }
  }, [status, session, router]);

  const handleRefreshSession = async () => {
    await update();
    window.location.reload();
  };

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/stats');
      if (!res.ok) {
        throw new Error('統計情報の取得に失敗しました');
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg">
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

  if (error) {
    return (
      <Container maxWidth="lg">
        <Paper sx={{ p: 3, mt: 4 }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      </Container>
    );
  }

  // 管理者権限がない場合の表示
  if (status === 'authenticated' && session.user?.role !== 'admin') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          管理者権限がありません。セッションを更新してください。
          <br />
          <small>{debugInfo}</small>
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshSession}
          sx={{ mt: 2 }}
        >
          セッションを更新
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            管理者ダッシュボード
          </Typography>
          <Typography variant="body1" color="text.secondary">
            システム全体の統計情報を確認できます
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={handleRefreshSession}
          size="small"
        >
          セッション更新
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    総ユーザー数
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ContactMailIcon sx={{ fontSize: 40, color: 'secondary.main', mr: 2 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {stats?.totalContacts || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    総お問合せ数
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          クイックアクセス
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Card
            sx={{ cursor: 'pointer', flex: 1 }}
            onClick={() => router.push('/admin/users')}
          >
            <CardContent>
              <Typography variant="h6">ユーザー管理</Typography>
              <Typography variant="body2" color="text.secondary">
                ユーザー一覧の確認・権限変更・削除
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{ cursor: 'pointer', flex: 1 }}
            onClick={() => router.push('/admin/contacts')}
          >
            <CardContent>
              <Typography variant="h6">お問合せ管理</Typography>
              <Typography variant="body2" color="text.secondary">
                お問合せ一覧の確認・詳細表示・削除
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
}

