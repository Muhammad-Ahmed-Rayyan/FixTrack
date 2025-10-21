import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import IssueForm from './IssueForm';
import IssueList from './IssueList';
import ProfileMenu from './ProfileMenu';
import UserManagement from './UserManagement';
import Profile from './Profile';
import Chatbot from './Chatbot';
import { FaCommentDots, FaBars, FaUsers, FaFileAlt, FaExclamationCircle, FaClipboardList, FaTimes } from 'react-icons/fa';
import './Dashboard.css';

interface UserData {
  name: string;
  email: string;
  isAdmin: boolean;
  isOwner: boolean;
  role?: 'admin' | 'road' | 'electric' | 'water' | 'gas' | 'power' | 'sanitation' | 'infrastructure' | 'waste' | 'traffic' | 'emergency';
  phone?: string;
  cnic?: string;
  address?: string;
}

interface ChatbotTrigger {
  category: string;
  text: string;
}

const Dashboard = ({ user }: { user: User }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [view, setView] = useState('dashboard');
  const [subView, setSubView] = useState('report'); 
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatbotTrigger, setChatbotTrigger] = useState<ChatbotTrigger | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const message = sessionStorage.getItem('successMessage');
    if (message) {
      setSuccessMessage(message);
      sessionStorage.removeItem('successMessage');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  }, [view, subView]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          setUserData(data);
          setSubView(data.isAdmin ? 'allReports' : 'report');
        } else {
          const newUser: UserData = {
            email: user.email!,
            name: user.displayName || 'User',
            isAdmin: false,
            isOwner: false,
          };
          await setDoc(userRef, newUser);
          setUserData(newUser);
          setSubView('report');
        }
      }
    };
    fetchUserData();
  }, [user]);
  
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (isMobile && isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            const mobileHeader = document.querySelector('.mobile-header');
            if (mobileHeader && !mobileHeader.contains(event.target as Node)) {
                setIsSidebarOpen(false);
            }
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [isMobile, isSidebarOpen]);

  const handleBackToDashboard = () => setView('dashboard');

  const handleSubmissionSuccess = (category: string, description: string) => {
    setChatbotTrigger({ category, text: description });
    setIsChatbotOpen(true);
    const message = sessionStorage.getItem('successMessage');
    if (message) {
      setSuccessMessage(message);
      sessionStorage.removeItem('successMessage');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
  };

  const handleChatbotClose = () => {
    setIsChatbotOpen(false);
    setChatbotTrigger(null);
  };

  const getDashboardTitle = () => {
    if (!userData) return "Loading...";

    if (userData.isAdmin) {
      if (userData.role === 'admin') {
        return "SUPER ADMIN DASHBOARD";
      } else {
        const department = userData.role ? userData.role.toUpperCase() : "";
        return `${department} DEPARTMENTAL DASHBOARD`;
      }
    } else {
      return "CITIZEN DASHBOARD";
    }
  };

  if (!userData) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  const renderDashboardContent = () => {
    switch (subView) {
      case 'report':
        return <IssueForm user={user} onSubmissionSuccess={handleSubmissionSuccess} />;
      case 'myReports':
        return <IssueList user={user} userData={userData} viewMode="personal" />;
      case 'allReports':
        return <IssueList user={user} userData={userData} viewMode={userData.isAdmin ? 'all' : 'personal'} />;
      default:
        return <IssueForm user={user} onSubmissionSuccess={handleSubmissionSuccess} />;
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'profile':
        return <Profile user={user} userData={userData} onBack={handleBackToDashboard} />;
      case 'users':
        return <UserManagement />;
      case 'dashboard':
      default:
        return renderDashboardContent();
    }
  };
  
  const getCardClassName = () => {
    if (view !== 'dashboard') return 'wide'; 

    switch (subView) {
      case 'allReports':
        return userData.isAdmin ? 'wide' : 'medium';
      case 'myReports':
        return 'medium';
      case 'report':
        return 'narrow';
      default:
        return 'narrow';
    }
  };

  const sidebarNav = (
    <div className="sidebar-nav">
        {userData && userData.isAdmin && userData.role === 'admin' && (
             <button onClick={() => { setView('users'); isMobile && setIsSidebarOpen(false);}} className={`${view === 'users' ? 'active' : ''} sidebar-nav-btn`}>
                <FaUsers /> <span>Manage Users</span>
             </button>
        )}
        {userData && userData.isAdmin && (
            <button onClick={() => { setView('dashboard'); setSubView('allReports'); isMobile && setIsSidebarOpen(false);}} className={`${view === 'dashboard' && subView === 'allReports' ? 'active' : ''} sidebar-nav-btn`}>
                <FaFileAlt /> <span>All Reports</span>
            </button>
        )}
        <button onClick={() => { setView('dashboard'); setSubView('report'); isMobile && setIsSidebarOpen(false);}} className={`${view === 'dashboard' && subView === 'report' ? 'active' : ''} sidebar-nav-btn`}>
            <FaExclamationCircle /> <span>Report Issue</span>
        </button>
        <button onClick={() => { setView('dashboard'); setSubView('myReports'); isMobile && setIsSidebarOpen(false);}} className={`${view === 'dashboard' && subView === 'myReports' ? 'active' : ''} sidebar-nav-btn`}>
            <FaClipboardList /> <span>My Reports</span>
        </button>
    </div>
  );

  return (
    <div className="dashboard-container">
      {successMessage && (
        <div className="success-dialog">
          <p>{successMessage}</p>
        </div>
      )}
      {isMobile && (
        <div className="mobile-header">
          <button onClick={() => setIsSidebarOpen(true)} className="sidebar-toggle-btn">
            <FaBars />
          </button>
          {userData && (
            <ProfileMenu
              user={user}
              userData={userData}
              onEditProfile={() => setView('profile')}
              isOwner={userData.isOwner}
              isAdmin={userData.isAdmin}
              role={userData.role}
              isSidebarClosed={true} // Always keep it compact
            />
          )}
        </div>
      )}

      <div ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-top">
        <div className="sidebar-header">
          {isSidebarOpen ? (
            <div className="sidebar-brand">
              <img src="/logo/FixTrack.png" alt="Logo" className="sidebar-logo" />
              <h1 className="sidebar-title">FixTrack</h1>
            </div>
          ) : null}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="sidebar-toggle-btn">
            {isMobile ? <FaTimes /> : <FaBars />}
          </button>
        </div>
          {sidebarNav}
        </div>
        {!isMobile && userData && (
          <div className="sidebar-footer">
            <ProfileMenu
              user={user}
              userData={userData}
              onEditProfile={() => setView('profile')}
              isOwner={userData.isOwner}
              isAdmin={userData.isAdmin}
              role={userData.role}
              isSidebarClosed={!isSidebarOpen}
            />
          </div>
        )}
      </div>

      {isMobile && <div className={`overlay ${isSidebarOpen ? 'visible' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>}

      <div className={`main-content ${!isMobile && isSidebarOpen ? 'shifted' : ''} ${isMobile ? 'mobile-padding' : ''}`}>
      <header className="dashboard-header">
          <div className="header-content">
              <h1 className="header-title">{getDashboardTitle()}</h1>
              <p className="header-subtitle">Welcome, {userData.name}!</p>
          </div>
        </header>
        <main className="dashboard-content">
          <div className={`dashboard-card ${getCardClassName()}`}>
            {renderContent()}
          </div>
        </main>
        <button className="chatbot-fab" onClick={() => setIsChatbotOpen(true)}>
          <FaCommentDots />
        </button>
        {isChatbotOpen && <Chatbot onClose={handleChatbotClose} trigger={chatbotTrigger} />}
      </div>
    </div>
  );
};
export default Dashboard;