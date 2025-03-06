import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
} from '@mui/material';
import { fetch } from '../../../api/Fetch';
import { useQuery } from '@tanstack/react-query';
import { getShop, getShopDetail } from '../../../api/shopApi'
const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '' });
  const {data} =  useQuery({
    queryKey:['getShop-detail'],
    queryFn: getShopDetail,
    retry: 1
})
  const fetchBlogs = async () => {
    try {
        console.log("data",data);
      const response = await fetch.get('/blog/'+data.id);
      setBlogs(response.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSave = async () => {
    try {
      if (editingBlog?.id) {
        await fetch.put(`/blog/${editingBlog.id}`, editingBlog);
      } else {
        const newBlog = {
            ...editingBlog,
            shopId: data.id, // Thêm shopId vào dữ liệu blog
        };
        await fetch.post('/blog', newBlog);
      }
      setNotification({ open: true, message: 'Lưu blog thành công!' });
      fetchBlogs();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving blog:', error);
      setNotification({ open: true, message: 'Lưu blog thất bại!' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch.delete(`/blog/${id}`);
      setNotification({ open: true, message: 'Xóa blog thành công!' });
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      setNotification({ open: true, message: 'Xóa blog thất bại!' });
    }
  };

  const handleOpenDialog = (blog = {}) => {
    setEditingBlog(blog);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBlog(null);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>Quản lý Blog</Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>Thêm Blog</Button>
      <Box mt={2}>
        {blogs.map((blog) => (
          <Card key={blog.id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{blog.title}</Typography>
              <Typography variant="body2" color="text.secondary">{blog.content}</Typography>
              <Box mt={2}>
                <Button variant="outlined" onClick={() => handleOpenDialog(blog)}>Sửa</Button>
                <Button variant="outlined" color="error" onClick={() => handleDelete(blog.id)} sx={{ ml: 2 }}>Xóa</Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingBlog?.id ? 'Chỉnh sửa Blog' : 'Thêm Blog'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            margin="normal"
            value={editingBlog?.title || ''}
            onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
          />
          <TextField
            label="Nội dung"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            value={editingBlog?.content || ''}
            onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        message={notification.message}
      />
    </Box>
  );
};

export default BlogManagement;
