import React, { useEffect, useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Box,
  Pagination,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../components/Navbar';
import FormModal from '../components/FormModal';

const drawerWidth = 220;

const BookList = ({ setToken }) => {
  const userRole = localStorage.getItem('user_role');
  const userID = localStorage.getItem('user_id');

  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const booksPerPage = 10;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedBook, setSelectedBook] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailBook, setDetailBook] = useState(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formValues, setFormValues] = useState({ title: '', author: '', isbn: '', published_date: '' });

  const bookFields = [
    { name: 'title', label: 'Title' },
    { name: 'author', label: 'Author' },
    { name: 'isbn', label: 'ISBN' },
    { name: 'published_date', label: 'Publish Date', type: 'date' },
  ];

  const handleOpenAdd = () => {
    setMode("add");
    setFormValues({ title: '', author: '', isbn: '', published_date: '' });
    setOpen(true);
  };

  const handleOpenEdit = (book) => {
    setMode("edit");
    setSelectedBook(book);
    setFormValues({
      title: book.title || '',
      author: book.author || '',
      isbn: book.isbn || '',
      published_date: book.published_date || '',
    });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (e) => setFormValues({ ...formValues, [e.target.name]: e.target.value });

  const handleOpenDetail = (book) => {
    setDetailBook(book);
    setDetailOpen(true);
  };
  const handleCloseDetail = () => {
    setDetailBook(null);
    setDetailOpen(false);
  };

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccessMessage("");
    window.location.reload();
  };

  const handleSubmit = () => {
    if (mode === "add") {
      fetch('http://localhost:8080/api/books', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to add book');
          return res.json();
        })
        .then((newBook) => {
          setBooks([newBook, ...books]);
          setOpen(false);
          setSuccessMessage("Book added successfully!");
          setSuccessOpen(true);
        })
        .catch(() => alert('Error adding book'));
    } else if (mode === "edit" && selectedBook) {
      fetch(`http://localhost:8080/api/books/${selectedBook.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to update book');
          return res.json();
        })
        .then((updatedBook) => {
          setBooks(books.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
          setOpen(false);
          setSuccessMessage("Book updated successfully!");
          setSuccessOpen(true);
        })
        .catch(() => alert('Error updating book'));
    }
  };

  useEffect(() => {
    fetch('http://localhost:8080/api/books', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBorrowBook = (book) => {
    if (!userID) {
      alert("User not logged in. Please log in again.");
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    fetch('http://localhost:8080/api/borrow-records', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        book_id: book.id,
        user_id: userID,
        borrowed_at: today,
        due_at: dueDateStr,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          console.error("Borrow API failed:", {
            status: res.status,
            statusText: res.statusText,
            responseText: text,
          });
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(() => {
        setBooks((prevBooks) =>
          prevBooks.map((b) =>
            b.id === book.id ? { ...b, status: 'not available' } : b
          )
        );
        setSuccessMessage(`You have successfully borrowed "${book.title}"!`);
        setSuccessOpen(true);
      })
      .catch((err) => {
        console.error("Borrow error:", err);
        alert("Failed to borrow book. Check console for details.");
      });
  };

  // Pagination
  const indexOfLastBook = page * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <div style={{ display: 'flex' }}>
      <Navbar setToken={setToken} activeTab="Books" />
      <main
        style={{
          flexGrow: 1,
          padding: '5rem',
          paddingTop: '100px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4">Book List</Typography>
          {userRole === 'librarian' && (
            <Button variant="contained" onClick={handleOpenAdd}>Add</Button>
          )}
        </Box>

        <Grid container spacing={3} justifyContent="center">
          {currentBooks.map((book) => (
            <Grid
              item
              xs={12} sm={6} md={4} lg={3}
              key={book.id}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Card
                variant="outlined"
                sx={{
                  width: 250,
                  height: 180,
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backgroundColor: book.status === 'available' ? '#e8f5e9' : '#ffebee',
                  borderLeft: `6px solid ${book.status === 'available' ? '#1976d2' : '#f44336'}`,
                  ":hover": { boxShadow: 6, backgroundColor: '#f5f5f5' }
                }}
              >
                {userRole === "librarian" && (
                  <IconButton
                    onClick={() => handleOpenEdit(book)}
                    size="small"
                    sx={{ position: 'absolute', top: 4, right: 4 }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}

                <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>{book.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{book.author}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{book.isbn}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>{book.published_date}</Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  <Button size="small" onClick={() => handleOpenDetail(book)}>Details</Button>
                  {userRole === "member" && book.status === "available" && (
                    <Button size="small" variant="contained" color="primary" onClick={() => handleBorrowBook(book)}>Borrow</Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

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

        {/* MODAL FORM */}
        <FormModal
          open={open}
          title={mode === "add" ? "Add New Book" : "Edit Book"}
          fields={bookFields}
          values={formValues}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
          submitLabel={mode === "add" ? "Add" : "Update"}
        />

        {/* DETAILS MODAL */}
        <Dialog open={detailOpen} onClose={handleCloseDetail} maxWidth="sm" fullWidth>
          <DialogTitle>Book Details</DialogTitle>
          <DialogContent>
            {detailBook && (
              <Card variant="outlined" sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h6">{detailBook.title}</Typography>
                  <Typography variant="subtitle1" color="text.secondary">{detailBook.author}</Typography>
                  <Typography variant="body2">ISBN: {detailBook.isbn}</Typography>
                  <Typography variant="body2">Published: {detailBook.published_date}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ mt: 1, fontWeight: "bold", color: detailBook.status === "available" ? "green" : "red" }}
                  >
                    Status: {detailBook.status}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </DialogContent>
        </Dialog>

        {/* SUCCESS MODAL */}
        <Dialog open={successOpen} onClose={handleCloseSuccess}>
          <DialogTitle>Success</DialogTitle>
          <DialogContent>
            <Typography>{successMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccess} autoFocus>OK</Button>
          </DialogActions>
        </Dialog>
      </main>
    </div>
  );
};

export default BookList;
