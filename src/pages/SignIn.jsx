import { useState, useEffect } from 'react'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/recognition');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/recognition'); 
      }
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <Spline
        scene="https://prod.spline.design/tP4YIGob63iDcG4w/scene.splinecode"
        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}
      />

      <div style={{ position: 'absolute', top: '20px', right: '5rem', zIndex: 2, color: '#a9eb42' }}>
        <button
          onClick={() => setShowForm(true)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#a9eb42',
            color: 'white',
            border: 'none',
            fontSize: '0.79rem',
            cursor: 'pointer',
          }}
        >
          Try Releaf
        </button>
      </div>

      {showForm && (
        <div
          style={{
            color: '#a9eb42',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '1rem',
            maxWidth: '26vw',
            width: '90%',
            zIndex: 3,
            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 style={{ textAlign: 'center' }}>{isSignIn ? 'Sign In Releaf' : 'Sign Up Releaf'}</h2>

            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                fontSize: '0.79rem',
              }}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #ccc',
                fontSize: '0.79rem',
              }}
            />

            <button
              type="submit"
              style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: '#a9eb42',
                color: 'white',
                fontSize: '0.79rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isSignIn ? 'Sign In' : 'Sign Up'}
            </button>

            <p style={{ color: 'red', textAlign: 'center', fontSize: '0.79rem' }}>{message}</p>

            <div style={{ textAlign: 'center', fontSize: '0.79rem' }}>
              {isSignIn ? (
                <>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(false)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#a9eb42',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.79rem',
                    }}
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setIsSignIn(true)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#a9eb42',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      fontSize: '0.79rem',
                    }}
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a9eb42',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '0.79rem',
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: '6vh',
          right: '5rem',
          zIndex: 2,
          color: 'black',
          fontSize: '0.79rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
        }}
      >
        Releaf — Nature, Without the Effort. Your Intelligent, Automated Plant Care System
      </div>
    </div>
  );
}

