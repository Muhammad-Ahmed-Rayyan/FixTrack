import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserData } from './types';
import LandingPage from './pages/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import IssueForm from './components/IssueForm';
import IssueList from './components/IssueList';
import UserManagement from './components/UserManagement';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './components/Dashboard.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        getDoc(doc(db, 'users', user.uid))
          .then(userDoc => {
            if (userDoc.exists()) {
              setUserData(userDoc.data() as UserData);
            } else {
              setUserData(null);
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setUserData(null);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleNavigate = (path: string) => {
    setIsNavigating(true);
    setTimeout(() => {
      window.location.pathname = path;
    }, 1000); 
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      {isNavigating && <LoadingSpinner />}
      <Routes>
        <Route path="/" element={<LandingPage handleNavigate={handleNavigate} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={user && userData ? <Profile user={user} userData={userData} onBack={() => window.history.back()} /> : <Navigate to="/login" />}
        />
        <Route
          path="/report-issue"
          element={user ? <IssueForm user={user} onSubmissionSuccess={() => {}} /> : <Navigate to="/login" />}
        />
        <Route
          path="/issues"
          element={user && userData ? <IssueList user={user} userData={userData} viewMode="personal" /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={user && userData && userData.isAdmin ? <UserManagement /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
