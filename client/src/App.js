import React,{useState} from 'react';
import { BrowserRouter as Router,Routes, Route , Redirect, useNavigate ,Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Main from './components/Main';
import AdminDashboard from './components/AdminDashboard';
import HomePage from './components/HomePage';
import Google from './components/Google';
import { GoogleLogin, GoogleOAuthProvider, googleLogout} from '@react-oauth/google';


function App() {
  const [user, setUser] = useState(null);
  const handleLogin = (userData) => {
    setUser(userData);
  };
 


  return (
    <Router>
     
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
        <Route path="/homepage" element={<HomePage/>}/>
       
        
      </Routes>
     

    </Router>
    
    
  );
}

export default App;

