import { useState, useEffect, useRef } from 'react';
import { auth } from '../firebaseConfig';
import { User, sendPasswordResetEmail } from 'firebase/auth';
import { FaChevronUp, FaUserEdit, FaKey, FaSignOutAlt } from 'react-icons/fa';
import './ProfileMenu.css';

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

interface ProfileMenuProps {
  user: User;
  userData: UserData | null;
  isOwner: boolean;
  isAdmin: boolean;
  role?: string;
  onEditProfile: () => void;
  isSidebarClosed?: boolean;
}

const ProfileMenu = ({ user, userData, onEditProfile, isSidebarClosed }: ProfileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [resetStatus, setResetStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (isOpen) setResetStatus(null);
  };

  const handleResetPassword = async () => {
    if (user.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        setResetStatus({ message: 'Password reset email sent!', isError: false });
      } catch (error) {
        console.error("Error sending password reset email: ", error);
        setResetStatus({ message: 'Failed to send reset email.', isError: true });
      }
    }
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
      if (!name) return "U";
      const nameArray = name.split(' ');
      if (nameArray.length > 1 && nameArray[1]) {
          return (nameArray[0][0] + nameArray[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-menu" ref={menuRef}>
      {isOpen && (
        <div className="profile-dropdown">
          <div className="user-info">
            <p>Signed in as</p>
            <strong>{user.email}</strong>
          </div>
          {resetStatus && (
            <div className={`reset-status ${resetStatus.isError ? 'error' : 'success'}`}>
              {resetStatus.message}
            </div>
          )}
          <ul>
            <li><button onClick={() => handleAction(onEditProfile)}><FaUserEdit /> <span>Edit Profile</span></button></li>
            <li><button onClick={handleResetPassword}><FaKey /> <span>Reset Password</span></button></li>
            <li><button onClick={handleLogout} className="logout-button"><FaSignOutAlt /> <span>Logout</span></button></li>
          </ul>
        </div>
      )}

      <button className="profile-menu-button" onClick={toggleMenu}>
          <div className="profile-button-content">
              <div className="initials-circle">
                {getInitials(userData?.name || '')}
              </div>
              {!isSidebarClosed && <span className="profile-name">{userData?.name || 'User'}</span>}
          </div>
          {!isSidebarClosed && <FaChevronUp className={`profile-arrow ${isOpen ? 'open' : ''}`} />}
      </button>
    </div>
  );
};

export default ProfileMenu;
