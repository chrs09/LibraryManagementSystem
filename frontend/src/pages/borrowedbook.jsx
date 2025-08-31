import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import Navbar from '../components/Navbar';
import axios from 'axios';

const drawerWidth = 220;

const BorrowedBooks = ({ setToken }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  const [borrows, setBorrows] = useState([]);
  const [page, setPage] = useState(1);
  const borrowsPerPage = 10;

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  };

  const fetchBorrows = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/borrowed-books', axiosConfig);
      setBorrows(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  // Pagination
  const indexOfLastBorrow = page * borrowsPerPage;
  const indexOfFirstBorrow = indexOfLastBorrow - borrowsPerPage;
  const currentBorrows = borrows.slice(indexOfFirstBorrow, indexOfLastBorrow);
  const totalPages = Math.ceil(borrows.length / borrowsPerPage);

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccessMessage("");
    fetchBorrows();
  };

  return (
    <div style={{ display: 'flex' }}>
      <Navbar setToken={setToken} activeTab="Borrowed Books" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: '100px',
        }}
      >
        <Typography variant="h4" sx={{ mb: 3 }}>Borrowed Books</Typography>

        {/* Responsive table */}
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Book Title</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Borrowed At</TableCell>
                  <TableCell>Due At</TableCell>
                  {userRole === 'librarian' && <TableCell>Borrowed By</TableCell>}
                </TableRow>
              </TableHead>
              <TableBody>
                {currentBorrows.map((borrow) => (
                  <TableRow key={borrow.id} hover>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{borrow.book?.title}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{borrow.book?.author}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{borrow.borrowed_at}</TableCell>
                    <TableCell sx={{ wordBreak: 'break-word' }}>{borrow.due_at}</TableCell>
                    {userRole === 'librarian' && (
                      <TableCell sx={{ wordBreak: 'break-word' }}>{borrow.book_user?.name}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        )}

        {/* SUCCESS DIALOG */}
        <Dialog open={successOpen} onClose={handleCloseSuccess}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>{successMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccess} autoFocus>OK</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
  );
};

export default BorrowedBooks;
