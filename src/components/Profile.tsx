import { useState } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { UserData } from '../types'; // Import UserData from types.ts
import './Profile.css';

interface ProfileProps {
  user: User;
  userData: UserData;
  onBack: () => void;
}

const Profile = ({ user, userData, onBack }: ProfileProps) => {
  const [name, setName] = useState(userData.name);
  const [phone, setPhone] = useState(userData.phone || '');
  const [cnic, setCnic] = useState(userData.cnic || '');
  const [address, setAddress] = useState(userData.address || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (phone && (phone.length !== 11 || !/^\d{11}$/.test(phone))) {
      setError('Phone number must be exactly 11 digits.');
      setLoading(false);
      return;
    }

    if (cnic && (cnic.length !== 13 || !/^\d{13}$/.test(cnic))) {
      setError('CNIC must be exactly 13 digits.');
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        name,
        phone,
        cnic,
        address,
      });
      setSuccess('Profile updated successfully!');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Edit Your Profile</h2>
      <form onSubmit={handleUpdate} className="profile-form">
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={userData.email} disabled />
        </div>
        <div className="form-group">
          <label>Phone (11 digits)</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} pattern="\d{11}" />
        </div>
        <div className="form-group">
          <label>CNIC (13 digits)</label>
          <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} pattern="\d{13}" />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <div className="profile-buttons">
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
          <button type="button" className="link-button" onClick={onBack}>
            Back to Dashboard
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
