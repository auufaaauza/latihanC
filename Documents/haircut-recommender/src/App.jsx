import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { auth } from './services/firebase';
import UploadPhoto from './components/UploadPhoto';
import History from './components/History';
import Auth from './components/Auth';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  if (loading) {
    return <div>Memuat aplikasi...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Auth /> : <Navigate to="/upload" />} />
      <Route path="/upload" element={user ? <UploadPhoto user={user} /> : <Navigate to="/login" />} />
      <Route path="/history" element={user ? <History user={user} /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={user ? "/upload" : "/login"} />} />
    </Routes>
  );
}