import * as React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Dashboard from "./pages/dashboard";
import BookList from "./pages/booklist";
import UserList from "./pages/userlist";
import BorrowedBooks from "./pages/borrowedbook";

export default function App() {
  // Lazy load token from localStorage
  const [token, setToken] = React.useState(() => localStorage.getItem("access_token"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setToken={setToken} />} />

        <Route
          path="/dashboard"
          element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />}
        />
        <Route
          path="/booklist"
          element={token ? <BookList setToken={setToken} /> : <Navigate to="/" />}
        />
        <Route
          path="/users"
          element={token ? <UserList setToken={setToken} /> : <Navigate to="/" />}
        />
        <Route
          path="/bookborrowed"
          element={token ? <BorrowedBooks setToken={setToken} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}
