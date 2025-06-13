// components/BreathingLogo.jsx
export default function BreathingLogo() {
  const handleLogoClick = () => {
    window.location.href = '/home';
  };

  return (
    <>
      <img
        src="/image/logo.png"
        alt="Logo"
        onClick={handleLogoClick}
        style={{
          position: 'fixed',
          top: '3vh',
          right: '3vw',
          width: '3rem',
          height: 'auto',
          zIndex: 1000,
          cursor: 'pointer',
          animation: 'pulse-glow 2s infinite',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = 'none';
          e.currentTarget.style.transform = 'scale(1.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = 'pulse-glow 2s infinite';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      />
      <style>
        {`
          @keyframes pulse-glow {
            0% {
              transform: scale(1);
              filter: drop-shadow(0 0 0px rgba(87, 255, 235, 0.6));
            }
            50% {
              transform: scale(1.3);
              filter: drop-shadow(0 0 10px rgba(74, 255, 234, 1));
            }
            100% {
              transform: scale(1);
              filter: drop-shadow(0 0 0px rgba(84, 255, 235, 0.6));
            }
          }
        `}
      </style>
    </>
  );
}
