import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility.js';
import DeleteIcon from '@mui/icons-material/Delete.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function AdminContacts() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchContacts = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/contacts');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'お問合せ一覧の取得に失敗しました');
      }
      const data = await res.json();
      console.log('Fetched contacts:', data);
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 既にフェッチ済みなら何もしない
    if (hasFetched.current) return;
    
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/contacts');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/admin/403');
        return;
      }
      // 管理者の場合のみデータを取得（一度だけ）
      hasFetched.current = true;
      fetchContacts();
    }
  }, [status, session?.user?.role, router]);

  const handleDetailClick = async (contact: Contact) => {
    try {
      const res = await fetch(`/api/admin/contacts/${contact.id}`);
      if (!res.ok) {
        throw new Error('お問合せ詳細の取得に失敗しました');
      }
      const data = await res.json();
      setSelectedContact(data);
      setDetailDialogOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const handleDeleteClick = (contact: Contact) => {
    setSelectedContact(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;

    try {
      const res = await fetch(`/api/admin/contacts/${selectedContact.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'お問合せの削除に失敗しました');
      }

      setDeleteDialogOpen(false);
      setSelectedContact(null);
      setSuccessMessage('お問合せを削除しました');
      setTimeout(() => setSuccessMessage(null), 3000);
      hasFetched.current = false;
      fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  // セッション読み込み中はローディング表示
  if (status === 'loading') {
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

  // データ読み込み中はローディング表示（ただしセッションは確定している）
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push('/admin')}
            sx={{ mr: 2 }}
          >
            ダッシュボードに戻る
          </Button>
          <Typography variant="h4" component="h1">
            お問合せ管理
          </Typography>
        </Box>
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/admin')}
          sx={{ mr: 2 }}
        >
          ダッシュボードに戻る
        </Button>
        <Typography variant="h4" component="h1">
          お問合せ管理
        </Typography>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>名前</TableCell>
                <TableCell>メールアドレス</TableCell>
                <TableCell>件名</TableCell>
                <TableCell>作成日時</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      お問合せが登録されていません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>{contact.name}</TableCell>
                    <TableCell>{contact.email}</TableCell>
                    <TableCell>{contact.subject}</TableCell>
                    <TableCell>
                      {new Date(contact.createdAt).toLocaleString('ja-JP')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleDetailClick(contact)}
                        >
                          詳細
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(contact)}
                        >
                          削除
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 詳細表示ダイアログ */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>お問合せ詳細</DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                名前
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {selectedContact.name}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                メールアドレス
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {selectedContact.email}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                件名
              </Typography>
              <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
                {selectedContact.subject}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                本文
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {selectedContact.message}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                作成日時
              </Typography>
              <Typography variant="body1">
                {new Date(selectedContact.createdAt).toLocaleString('ja-JP')}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialogOpen(false)}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>お問合せを削除</DialogTitle>
        <DialogContent>
          <Typography>
            本当にお問合せ「{selectedContact?.subject}」を削除しますか？
            <br />
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteContact} variant="contained" color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
