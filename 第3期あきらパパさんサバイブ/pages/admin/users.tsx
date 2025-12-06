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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit.js';
import DeleteIcon from '@mui/icons-material/Delete.js';
import ArrowBackIcon from '@mui/icons-material/ArrowBack.js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchUsers = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'ユーザー一覧の取得に失敗しました');
      }
      const data = await res.json();
      console.log('Fetched users:', data);
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 既にフェッチ済みなら何もしない
    if (hasFetched.current) return;
    
    if (status === 'loading') return;

    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/admin/users');
      return;
    }

    if (status === 'authenticated') {
      if (session?.user?.role !== 'admin') {
        router.push('/admin/403');
        return;
      }
      // 管理者の場合のみデータを取得（一度だけ）
      hasFetched.current = true;
      fetchUsers();
    }
  }, [status, session?.user?.role, router]);

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || '権限の更新に失敗しました');
      }

      setEditDialogOpen(false);
      setSelectedUser(null);
      setSuccessMessage('権限を更新しました');
      setTimeout(() => setSuccessMessage(null), 3000);
      hasFetched.current = false;
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'ユーザーの削除に失敗しました');
      }

      setDeleteDialogOpen(false);
      setSelectedUser(null);
      setSuccessMessage('ユーザーを削除しました');
      setTimeout(() => setSuccessMessage(null), 3000);
      hasFetched.current = false;
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました');
    }
  };

  const handleRefresh = () => {
    hasFetched.current = false;
    setLoading(true);
    fetchUsers();
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
            ユーザー管理
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
          ユーザー管理
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
                <TableCell>権限</TableCell>
                <TableCell>作成日時</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      ユーザーが登録されていません
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? '管理者' : '一般ユーザー'}
                        color={user.role === 'admin' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleString('ja-JP')}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<EditIcon />}
                          onClick={() => handleEditClick(user)}
                        >
                          編集
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(user)}
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

      {/* 権限変更ダイアログ */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>権限を変更</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              ユーザー: {selectedUser?.name} ({selectedUser?.email})
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>権限</InputLabel>
              <Select
                value={newRole}
                label="権限"
                onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
              >
                <MenuItem value="user">一般ユーザー</MenuItem>
                <MenuItem value="admin">管理者</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            更新
          </Button>
        </DialogActions>
      </Dialog>

      {/* 削除確認ダイアログ */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>ユーザーを削除</DialogTitle>
        <DialogContent>
          <Typography>
            本当にユーザー「{selectedUser?.name} ({selectedUser?.email})」を削除しますか？
            <br />
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>キャンセル</Button>
          <Button onClick={handleDeleteUser} variant="contained" color="error">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}



