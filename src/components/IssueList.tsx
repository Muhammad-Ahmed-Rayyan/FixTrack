// IssueList.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { UserData } from '../types';
import './IssueList.css';
import { FaEdit, FaTrash, FaSave, FaMapMarkerAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface Issue {
  id: string;
  description: string;
  location: string | LocationData;
  locationDetails?: string;
  status: string;
  userEmail: string;
  createdAt: any;
  imageUrl?: string;
  category?: string;
}

interface IssueListProps {
  user: User;
  userData: UserData;
  viewMode: 'all' | 'personal';
}

const IssueList: React.FC<IssueListProps> = ({ user, userData, viewMode }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [editingIssueId, setEditingIssueId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedLocation, setEditedLocation] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [issueToDelete, setIssueToDelete] = useState<string | null>(null);

  const [imageFilter, setImageFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const roleToCategoryMap: { [key: string]: string } = {
    road: 'Road Damage / Potholes',
    electric: 'Street Light Issues',
    water: 'Water Leakage / Shortage',
    gas: 'Gas Leakage / Connection Issue',
    power: 'Electricity Outage / Pole Damage',
    sanitation: 'Sewerage / Drainage Problems',
    infrastructure: 'Bridge or Footpath Damage',
    waste: 'Garbage Collection / Overflow',
    traffic: 'Road Blockage / Accidents',
    emergency: 'Fire / Emergency Services',
  };

  useEffect(() => {
    let q;
    if (viewMode === 'personal') {
      q = query(collection(db, 'issues'), where('reportedBy', '==', user.uid));
    } else if (userData.isAdmin) {
      if (userData.role === 'admin') {
        q = query(collection(db, 'issues'));
      } else if (userData.role) {
        const category = roleToCategoryMap[userData.role];
        q = query(collection(db, 'issues'), where('category', '==', category));
      }
    } else {
      q = query(collection(db, 'issues'), where('reportedBy', '==', user.uid));
    }

    if (q) {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const issuesData: Issue[] = [];
        querySnapshot.forEach((d) => {
          issuesData.push({ id: d.id, ...(d.data() as any) } as Issue);
        });
        setIssues(
          issuesData.sort(
            (a, b) =>
              (b.createdAt?.toMillis ? b.createdAt?.toMillis() : 0) - (a.createdAt?.toMillis ? a.createdAt?.toMillis() : 0)
          )
        );
      });
      return () => unsubscribe();
    }
  }, [user.uid, userData.isAdmin, userData.role, viewMode]);

  const getLocationString = (location: string | LocationData, locationDetails?: string): string => {
    let locationString = '';

    if (typeof location === 'object' && location !== null && typeof location.lat === 'number' && typeof location.lng === 'number') {
      locationString = `Lat: ${location.lat.toFixed(5)}, Lng: ${location.lng.toFixed(5)}`;
    } else if (typeof location === 'string') {
      locationString = location;
    }

    if (locationDetails) {
      if (locationString) {
        return `${locationDetails}`; // preserve your existing behavior
      }
      return locationDetails;
    }

    return locationString || 'Not specified';
  };

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const hasImage = !!issue.imageUrl;
      if (imageFilter === 'withImage' && !hasImage) return false;
      if (imageFilter === 'withoutImage' && hasImage) return false;
      if (locationFilter !== 'all' && getLocationString(issue.location, issue.locationDetails) !== locationFilter) return false;
      if (categoryFilter !== 'all' && issue.category !== categoryFilter) return false;
      if (statusFilter !== 'all' && issue.status !== statusFilter) return false;
      return true;
    });
  }, [issues, imageFilter, locationFilter, categoryFilter, statusFilter]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set(issues.map((issue) => getLocationString(issue.location, issue.locationDetails)));
    return ['all', ...Array.from(locations)];
  }, [issues]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set(issues.map((issue) => issue.category || 'N/A'));
    return ['all', ...Array.from(categories)];
  }, [issues]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set(issues.map((issue) => issue.status));
    return ['all', ...Array.from(statuses)];
  }, [issues]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const issueRef = doc(db, 'issues', id);
    await updateDoc(issueRef, { status: newStatus });
  };

  const handleEdit = (issue: Issue) => {
    setEditingIssueId(issue.id);
    setEditedDescription(issue.description || '');
    setEditedLocation(getLocationString(issue.location, issue.locationDetails) || '');
  };

  const handleSave = async (id: string) => {
    const issueRef = doc(db, 'issues', id);
    await updateDoc(issueRef, {
      description: editedDescription,
      locationDetails: editedLocation,
    });
    setEditingIssueId(null);
  };

  const handleDeleteRequest = (id: string) => {
    setIssueToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (issueToDelete) {
      const issueRef = doc(db, 'issues', issueToDelete);
      await deleteDoc(issueRef);
      setIssueToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const cancelDelete = () => {
    setIssueToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleCancel = () => {
    setEditingIssueId(null);
  };

  const resetFilters = () => {
    setImageFilter('all');
    setLocationFilter('all');
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  const renderAdminView = () => (
    <div className="admin-view">
      <div className="table-container">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="imageFilter">Image</label>
            <select id="imageFilter" value={imageFilter} onChange={(e) => setImageFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="withImage">With Image</option>
              <option value="withoutImage">Without Image</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="locationFilter">Location</label>
            <select id="locationFilter" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              {uniqueLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'all' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="categoryFilter">Category</label>
            <select id="categoryFilter" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Statuses' : status}
                </option>
              ))}
            </select>
          </div>
          <button onClick={resetFilters} className="reset-filters-btn">
            Reset
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Description</th>
              <th>Location</th>
              <th>Image</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredIssues.map((issue) => (
              <tr key={issue.id}>
                <td>{issue.category || 'N/A'}</td>
                <td className="description-cell">
                  {editingIssueId === issue.id ? (
                    <textarea value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className="edit-textarea" />
                  ) : (
                    issue.description
                  )}
                </td>
                <td>
                  {editingIssueId === issue.id ? (
                    <input type="text" value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)} className="edit-input" />
                  ) : (
                    getLocationString(issue.location, issue.locationDetails)
                  )}
                </td>
                <td>
                  {issue.imageUrl ? (
                    <a href={issue.imageUrl} target="_blank" rel="noopener noreferrer">
                      <img src={issue.imageUrl} alt="Issue" style={{ width: '100px', height: 'auto', borderRadius: '4px' }} />
                    </a>
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{issue.userEmail}</td>
                <td>
                  {editingIssueId === issue.id ? (
                    <span className={`status-badge status-${issue.status.replace(/\s+/g, '-').toLowerCase()}`}>{issue.status}</span>
                  ) : (
                    <select value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value)} className="status-select">
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="closed">Closed</option>
                    </select>
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    {editingIssueId === issue.id ? (
                      <>
                        <button onClick={() => handleSave(issue.id)} className="glass-btn">
                          <FaSave color="white" />
                        </button>
                        <button onClick={handleCancel} className="glass-btn">
                          <FaTimes color="white" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(issue)} className="glass-btn">
                          <FaEdit color="white" />
                        </button>
                        <button onClick={() => handleDeleteRequest(issue.id)} className="glass-btn">
                          <FaTrash color="white" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderCitizenView = () => {
    if (issues.length === 0) {
      return (
        <div className="citizen-view">
          <div className="no-issues-message">You have no issues reported currently.</div>
        </div>
      );
    }

    return (
      <div className="citizen-view">
        <div className="issue-grid">
          {issues.map((issue) => (
            <div key={issue.id} className="issue-card">
              {editingIssueId === issue.id ? (
                <div className="editing-view">
                  <h3 className="editing-title">Edit Report</h3>
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="edit-textarea"
                    placeholder="Description"
                  />
                  <input type="text" value={editedLocation} onChange={(e) => setEditedLocation(e.target.value)} className="edit-input" placeholder="Location Details" />
                  <div className="editing-actions">
                    <button onClick={() => handleSave(issue.id)} className="edit-btn save-btn">
                      <FaSave /> Save
                    </button>
                    <button onClick={handleCancel} className="edit-btn cancel-btn">
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="card-image-container">
                    {issue.imageUrl ? (
                      <img src={issue.imageUrl} alt={issue.category || 'issue'} className="card-image" />
                    ) : (
                      <div className="no-image-placeholder">
                        <span>No Image</span>
                      </div>
                    )}
                    <div className={`status-badge status-${issue.status.replace(/\s+/g, '-').toLowerCase()}`}>{issue.status}</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">{issue.category}</h3>
                    <p className="card-description">{issue.description}</p>
                    <div className="card-meta">
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>{new Date(issue.createdAt?.toDate ? issue.createdAt.toDate() : issue.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="meta-item">
                        <FaMapMarkerAlt className="meta-icon" />
                        <span>{getLocationString(issue.location, issue.locationDetails)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="card-actions-overlay">
                    <button onClick={() => handleEdit(issue)} className="overlay-btn">
                      <FaEdit /> Edit
                    </button>
                    <button onClick={() => handleDeleteRequest(issue.id)} className="overlay-btn">
                      <FaTrash /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const mainContent = () => {
    if (viewMode === 'personal') {
      return renderCitizenView();
    } else {
      return userData.isAdmin ? renderAdminView() : renderCitizenView();
    }
  };

  return (
    <>
      {mainContent()}
      {showDeleteConfirm && (
        <div className="confirmation-dialog-overlay">
          <div className="confirmation-dialog">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this issue? This action cannot be undone.</p>
            <div className="dialog-buttons">
              <button onClick={confirmDelete} className="dialog-button confirm">
                Delete
              </button>
              <button onClick={cancelDelete} className="dialog-button cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IssueList;
