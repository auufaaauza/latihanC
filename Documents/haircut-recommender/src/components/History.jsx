import { useEffect, useState } from 'react';
import { getHistory } from '../services/firebase';

export default function History({ user }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(user.uid);
        setHistory(data);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHistory();
  }, [user]);

  if (loading) return <div>Memuat riwayat...</div>;

  return (
    <div className="history">
      <h2>Riwayat Rekomendasi</h2>
      {history.length === 0 ? (
        <p>Belum ada riwayat rekomendasi</p>
      ) : (
        history.map(item => (
          <div key={item.id} className="history-item">
            <img src={item.photoURL} alt="Wajah" width="100" />
            <div>
              <p>Bentuk Wajah: {item.faceShape}</p>
              <p>Waktu: {new Date(item.timestamp.seconds * 1000).toLocaleString()}</p>
              <ul>
                {item.recommendations.map((rec, idx) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
}