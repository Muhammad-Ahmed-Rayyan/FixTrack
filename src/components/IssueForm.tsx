import { useState, useEffect, useRef } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import './IssueForm.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Leaflet's default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface IssueFormProps {
  user: User;
  onSubmissionSuccess: (category: string, description: string) => void;
}

interface Location {
  lat: number;
  lng: number;
}

const IssueForm = ({ user, onSubmissionSuccess }: IssueFormProps) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Road Damage / Potholes');
  const [image, setImage] = useState<File | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationDetails, setLocationDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const CLOUD_NAME = 'YOUR-CLOUDINARY-CLOUD-NAME';
  const UPLOAD_PRESET = 'YOUR-CLOUDINARY-UPLOAD-PRESET';
  const categories = [
    "Road Damage / Potholes",
    "Street Light Issues",
    "Water Leakage / Shortage",
    "Gas Leakage / Connection Issue",
    "Electricity Outage / Pole Damage",
    "Sewerage / Drainage Problems",
    "Bridge or Footpath Damage",
    "Garbage Collection / Overflow",
    "Road Blockage / Accidents",
    "Fire / Emergency Services",
  ];

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('issue-map').setView([24.8607, 67.0011], 13);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      const provider = new OpenStreetMapProvider();
      const searchControl = GeoSearchControl({
        provider: provider,
        style: 'bar',
        showMarker: false,
        autoClose: true,
      });
      map.addControl(searchControl);

      map.on('geosearch/showlocation', (result: any) => {
        const { y: lat, x: lng } = result.location;
        setLocation({ lat, lng });
        map.setView([lat, lng], 16);
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }
      });

      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setLocation({ lat, lng });

        if (markerRef.current) {
          markerRef.current.setLatLng(e.latlng);
        } else {
          markerRef.current = L.marker(e.latlng).addTo(map);
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!location) {
        alert('Please select a location on the map.');
        return;
    }

    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (image) {
        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', UPLOAD_PRESET);
        const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST', body: formData,
        });
        if (cloudinaryResponse.ok) {
          imageUrl = (await cloudinaryResponse.json()).secure_url;
        } else {
          throw new Error('Image upload failed');
        }
      }

      await addDoc(collection(db, 'issues'), {
        description,
        location,
        locationDetails,
        category,
        imageUrl,
        status: 'open',
        reportedBy: user.uid,
        userEmail: user.email,
        createdAt: serverTimestamp(),
        confidence: 1, // Default confidence to 1 as it's user-selected
      });
      
      sessionStorage.setItem('successMessage', 'Your issue has been successfully submitted. Thank you for your feedback! We will review it shortly.');
      onSubmissionSuccess(category, description);

      if (markerRef.current && mapRef.current) {
        mapRef.current.removeLayer(markerRef.current);
        markerRef.current = null;
      }

      setDescription('');
      setCategory('Road Damage / Potholes');
      setImage(null);
      setLocation(null);
      setLocationDetails('');

      const fileInput = document.getElementById('image') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Failed to submit issue: ', error);
      setStatusMessage({ type: 'error', text: 'Failed to submit issue. Please try again.' });
      setTimeout(() => setStatusMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="issue-form" onSubmit={handleSubmit}>
      {statusMessage && <div className={`status-message ${statusMessage.type}`}>{statusMessage.text}</div>}
      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} required>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="description">Issue Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="form-group">
        <label>Location</label>
        <div id="issue-map" style={{ height: '400px', width: '100%' }}></div>
        {location && <p>Selected coordinates: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="location-details">Location Details</label>
        <input id="location-details" type="text" value={locationDetails} onChange={(e) => setLocationDetails(e.target.value)} />
      </div>
      <div className="form-group">
        <label htmlFor="image">Upload Image (Optional)</label>
        <input id="image" type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Issue'}
      </button>
    </form>
  );
};

export default IssueForm;
