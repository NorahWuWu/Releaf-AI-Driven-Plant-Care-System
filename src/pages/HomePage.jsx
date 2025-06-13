import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Spline from '@splinetool/react-spline';

export default function HomePage() {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path); 
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#fff',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
     
      <div
        style={{
          position: 'absolute',
          top: '-1vh',
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 1,
          scale: '1.3',
        }}
      >
        <Spline scene="https://prod.spline.design/QEKGneqjBuCt43HJ/scene.splinecode" />
      </div>

      
      <div
        style={{
          backgroundColor: '#BDFE00',
          borderRadius: '2rem',
          padding: '1rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '2rem',
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%) scale(0.66)',
          zIndex: 2,
        }}
      >
        <img
          src="/image/data.png"
          alt="DATA"
          onClick={() => handleNavigate('/plant-status')}
          style={iconStyle}
        />
        <img
          src="/image/alerts.png"
          alt="ALERTS"
          onClick={() => handleNavigate('/news')}
          style={iconStyle}
        />
        <img
          src="/image/profie.png"
          alt="PROFILE"
          onClick={() => handleNavigate('/me')}
          style={iconStyle}
        />
        <img
          src="/image/tips.png"
          alt="TIPS"
          onClick={() => handleNavigate('/care-solution')}
          style={iconStyle}
        />
      </div>

      
      <style>
        {`
          @keyframes pulse {
            0% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(33, 255, 229, 1)); }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 10px rgb(0, 205, 181)); }
            100% { transform: scale(1); filter: drop-shadow(0 0 6px rgba(3, 255, 209, 1)); }
          }
        `}
      </style>
    </div>
  );
}

const iconStyle = {
  width: '4rem',
  height: '4rem',
  cursor: 'pointer',
  animation: 'pulse 2s infinite',
  transition: 'transform 0.3s ease',
};
