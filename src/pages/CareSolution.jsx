import { useEffect } from 'react';
import Spline from '@splinetool/react-spline';

export default function CareSolution() {
  useEffect(() => {
   
    document.body.style.overflow = 'hidden';
    document.body.style.margin = '0';
    document.body.style.padding = '0';

   
    document.body.style.touchAction = 'none';

   
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);

  const handleLogoClick = () => {
    window.location.href = '/home';
  };

  return (
    <div style={{ width: '100vw', height: '100vh', margin: 0, padding: 0, position: 'relative' }}>
      <Spline scene="https://prod.spline.design/74ByU80JPREwj29J/scene.splinecode" />

    </div>
  );
}
