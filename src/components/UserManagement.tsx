import { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import './UserManagement.css';

interface UserData {
  id: string;
  name?: string;
  email: string;
  phone?: string;
  cnic?: string;
  address?: string;
  isAdmin?: boolean;
  role?: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const departments = [
    { value: "user", label: "User" },
    { value: "road", label: "Road Department" },
    { value: "electric", label: "Electric Works" },
    { value: "water", label: "Water Supply" },
    { value: "gas", label: "Gas Department" },
    { value: "power", label: "Power Department" },
    { value: "sanitation", label: "Sanitation" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "waste", label: "Waste Management" },
    { value: "traffic", label: "Traffic Control" },
    { value: "emergency", label: "Emergency Response" },
    { value: "admin", label: "Super Admin" },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserData));
        setUsers(usersList);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const userDoc = doc(db, 'users', userId);
      const isAdmin = newRole !== 'user';
      await updateDoc(userDoc, { role: newRole, isAdmin });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole, isAdmin } : u));
    } catch (err) {
      setError('Failed to update user role.');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-management-container dashboard-card">
      <h2 className="user-management-title">Manage Users</h2>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>CNIC</th>
              <th>Address</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name || 'N/A'}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.cnic || 'N/A'}</td>
                <td>{user.address || 'N/A'}</td>
                <td>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="role-select"
                  >
                    {departments.map(dep => (
                      <option key={dep.value} value={dep.value}>{dep.label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
