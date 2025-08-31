import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import Navbar from '../components/Navbar';

const Dashboard = ({ setToken }) => {
  const [stats, setStats] = useState({
    totalBorrowers: 0,
    totalBooks: 0,
    booksBorrowed: 0,
    booksOverdue: 0,
  });

  const userRole = localStorage.getItem("user_role"); // get logged-in user role

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const [usersRes, booksRes, borrowedRes] = await Promise.all([
          fetch("http://localhost:8080/api/users", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/books", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://localhost:8080/api/borrowed-books", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const usersData = await usersRes.json();
        const booksData = await booksRes.json();
        const borrowData = await borrowedRes.json();

        const usersArray = usersData.data || usersData;
        const booksArray = booksData.data || booksData;
        const borrowArray = borrowData.data || borrowData;

        setStats({
          totalBorrowers: usersArray.length,
          totalBooks: booksArray.length,
          booksBorrowed: borrowArray.filter((r) => !r.returned_at).length,
          booksOverdue: borrowArray.filter(
            (r) => !r.returned_at && new Date(r.due_at) < new Date()
          ).length,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    ...(userRole === "member"
      ? []
      : [{ title: 'Number of Borrowers', value: stats.totalBorrowers, background: '#f44336' }]),
    { title: 'No. of Books', value: stats.totalBooks, background: '#2196f3' },
    { title: 'Books Borrowed', value: stats.booksBorrowed, background: '#4caf50' },
    { title: 'Books Overdue', value: stats.booksOverdue, background: '#ff9800' },
  ];

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar setToken={setToken} />
      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, sm: 3, md: 5 }, mt: { xs: 8, sm: 10 } }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome to your Library Management System!
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {cards.map((item) => (
            <Grid 
              item 
              xs={12}  // full width on mobile
              sm={6}   // 2 per row on small screens
              md={3}   // 4 per row on medium+ screens
              key={item.title}
              sx={{ display: 'flex' }} // ensures all cards stretch equally
            >
              <Card
                sx={{
                  flexGrow: 1,            // makes card fill its Grid item
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: item.background,
                  color: '#fff',
                  minHeight: 200,         // minimum height for consistency
                  width: '100%',          // ensures card takes full width of Grid item
                }}
              >
                <CardContent sx={{ width: '100%' }}>
                  <Typography variant="h6" align="center">{item.title}</Typography>
                  <Typography variant="h4" align="center">{item.value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

      </Box>
    </Box>
  );
};

export default Dashboard;
