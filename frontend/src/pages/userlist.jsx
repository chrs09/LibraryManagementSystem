import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../components/Navbar';
import FormModal from '../components/FormModal';
import axios from 'axios';

const drawerWidth = 220;

const UserList = ({ setToken }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("add"); // "add" or "edit"
  const [selectedUser, setSelectedUser] = useState(null);

  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formValues, setFormValues] = useState({ name: '', email: '', password: '', role: 'member' });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  };

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/users', axiosConfig);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Open Add
  const handleOpenAdd = () => {
    setMode("add");
    setFormValues({ name: '', email: '', password: '', role: 'member' });
    setOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (user) => {
    setMode("edit");
    setSelectedUser(user);
    setFormValues({ ...user, password: '' });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      let payload = { ...formValues };

      // Remove role when adding so DB default is used
      if (mode === "add") delete payload.role;

      if (mode === "add") {
        const res = await axios.post('http://localhost:8080/api/users', payload, axiosConfig);
        setUsers([res.data, ...users]);
        setSuccessMessage("User added successfully!");
      } else if (mode === "edit" && selectedUser) {
        const res = await axios.put(`http://localhost:8080/api/users/${selectedUser.id}`, payload, axiosConfig);
        setUsers(users.map(u => u.id === res.data.id ? res.data : u));
        setSuccessMessage("User updated successfully!");
      }

      setOpen(false);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      console.error(err.response?.data); 
      alert("Error saving user");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`, axiosConfig);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting user");
    }
  };

  // Pagination
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleCloseSuccess = () => {
    setSuccessOpen(false);
    setSuccessMessage("");
    fetchUsers();
  };

  // Form fields
  const userFields = [
    { name: 'name', label: 'Name' },
    { name: 'email', label: 'Email' },
    ...(mode === "edit" ? [{ name: 'role', label: 'Role', type: 'select', options: ['librarian', 'member'] }] : []),
    { name: 'password', label: 'Password', type: 'password' },
  ];
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <div style={{ display: 'flex' }}>
      <Navbar setToken={setToken} activeTab="User List" />
      <Box component="main" sx={{ flexGrow: 1, p: 3, pt: '100px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">User List</Typography>
          {userRole === 'librarian' && (
            <Button variant="contained" onClick={handleOpenAdd}>Add User</Button>
          )}
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                {userRole === 'librarian' && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map(user => (
                <TableRow
                  key={user.id}
                  hover
                  onClick={() => userRole === 'librarian' && handleOpenEdit(user)}
                  sx={{ cursor: userRole === 'librarian' ? 'pointer' : 'default' }}
                >
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  {userRole === 'librarian' && (
                    <TableCell align="right">
                      <IconButton onClick={(e) => { e.stopPropagation(); handleOpenEdit(user); }} size="small">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <Button size="small" color="error" onClick={(e) => { e.stopPropagation(); handleDelete(user.id); }}>Delete</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

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

        {/* FORM MODAL */}
        <FormModal
          open={open}
          title={mode === "add" ? "Add New User" : "Edit User"}
          fields={userFields}
          values={formValues}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
          submitLabel={mode === "add" ? "Add" : "Update"}
        />

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

export default UserList;
