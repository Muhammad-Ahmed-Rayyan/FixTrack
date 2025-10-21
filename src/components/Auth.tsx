import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { FaArrowLeft } from 'react-icons/fa';
import './Auth.css';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/register') {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        if (!name) {
          setError('Please enter your name.');
          setLoading(false);
          return;
        }
        if (phone.length !== 11 || !/^\d{11}$/.test(phone)) {
          setError('Phone number must be exactly 11 digits.');
          setLoading(false);
          return;
        }

        if (cnic.length !== 13 || !/^\d{13}$/.test(cnic)) {
          setError('CNIC must be exactly 13 digits.');
          setLoading(false);
          return;
        }

        if (!address) {
          setError('Please enter your address.');
          setLoading(false);
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        sessionStorage.setItem('successMessage', `Successfully registered & logged in as ${user.email}`);

        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: user.email,
          phone: phone,
          cnic: cnic,
          address: address,
          isAdmin: false,
          isOwner: false,
        });
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('successMessage', `Successfully logged in as ${userCredential.user.email}`);
      }
      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithRedirect(auth, provider);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError('Please enter your email.');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! If you don\'t see it, please check your spam folder.');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
    setIsForgotPassword(false);
  };

  const toggleForgotPasswordMode = () => {
    setIsForgotPassword(!isForgotPassword);
    setError('');
    setSuccess('');
    setIsSignUp(false);
  };

  if (isForgotPassword) {
    return (
      <div className="auth-container">
        <div className="back-to-home-corner">
          <a onClick={() => navigate('/')}><FaArrowLeft /></a>
        </div>
        <h1 className="main-title">
          <img src="/logo/FixTrack.png" alt="FixTrack Logo" className="logo" />
          FixTrack
        </h1>
        <div className="auth-form">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your registered email" />
            </div>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          <div className="toggle-auth">
            <a onClick={toggleForgotPasswordMode}>Back to Login</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="back-to-home-corner">
        <a onClick={() => navigate('/')}><FaArrowLeft /></a>
      </div>
      <h1 className="main-title">
        <img src="/logo/FixTrack.png" alt="FixTrack Logo" className="logo" />
        FixTrack
      </h1>
      <div className="auth-form">
        <h2>{isSignUp ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleAuth}>
          {isSignUp && (
            <>
              <div className="input-group">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              </div>
              <div className="input-group">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (11 digits)" />
              </div>
              <div className="input-group">
                <input type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="CNIC (13 digits)" />
              </div>
              <div className="input-group">
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
              </div>
            </>
          )}
          <div className="input-group">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          </div>
          <div className="input-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          </div>
          {error && <p className="error-message">{error}</p>}
          {!isSignUp && (
            <div className="toggle-auth">
              <a onClick={toggleForgotPasswordMode}>Forgot Password?</a>
            </div>
          )}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignUp ? 'Registering...' : 'Logging In...') : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <div className="or-divider">
          <span className="or-line"></span>
          <span className="or-text">{isSignUp ? 'OR Sign UP with' : 'OR continue with'}</span>
          <span className="or-line"></span>
        </div>
        <button onClick={handleGoogleAuth} className="google-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
          Google
        </button>
        <div className="toggle-auth">
          <a onClick={toggleAuthMode}>
            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Auth;
