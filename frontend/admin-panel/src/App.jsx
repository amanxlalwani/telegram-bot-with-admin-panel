import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './components/SignIn';
import AdminPanel from './components/AdminPanel';
import axios from 'axios';
import { data } from 'autoprefixer';
import { Toaster } from 'react-hot-toast';

function App() {
    const BACKEND_URL="http://localhost:3000"
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(()=>{
    axios.get(`${BACKEND_URL}/auth/me`,{headers:{Authorization: `Bearer ${localStorage.getItem("token")}`}}).then((res)=>{
      console.log(res);
      
      if(res.data.verified){
        setIsAuthenticated(true);
      }else{
        setIsAuthenticated(false);
      }
    })
    })
    return (
       <>       
        <div><Toaster></Toaster></div>
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        isAuthenticated ? (
                            <Navigate to="/admin" replace />
                        ) : (
                            <SignIn onSignIn={() => setIsAuthenticated(true)} />
                        )
                    }
                />
                <Route
                    path="/admin"
                    element={
                        isAuthenticated ? (
                            <AdminPanel />
                        ) : (
                            <Navigate to="/" replace />
                        )
                    }
                />
            </Routes>
        </Router></>

    );
}

export default App;
