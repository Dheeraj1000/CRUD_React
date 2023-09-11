
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import Main from './Main';
import HomePage from './HomePage';
import Google from './Google';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === '1');

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdmin(localStorage.getItem('role') === '1'); 
  };

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    const userId = localStorage.getItem('userid');

    if (!token || !userId) {
      console.error('No token');
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={isLoggedIn ? <Navigate replace to="/dashboard" /> : <Register />} />
          {isLoggedIn ? (
            <>
              <Route path="/dashboard" element={isAdmin ? <Navigate replace to="/admin/dashboard" /> : <Dashboard />} />
              {isAdmin && <Route path="/admin/dashboard" element={<AdminDashboard />} />}
            </>
          ) : (
            <Navigate to="/login" />
          )}
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/googlelogin" element={<Google/>}/>
        </Routes>
      </div>
    </Router>
  );
};

export default Home;
