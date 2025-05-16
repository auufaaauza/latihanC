import { useState } from 'react';
import { storage, saveRecommendation } from '../services/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { analyzeFaceShape } from '../services/visionAPI';

export default function UploadPhoto({ user }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recommendation, setRecommendation] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      setError('Silakan pilih foto wajah terlebih dahulu');
      return;
    }

    try {
      setLoading(true);
      
      // Upload ke Firebase Storage
      const storageRef = ref(storage, `photos/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Analisis bentuk wajah
      const faceShape = await analyzeFaceShape(photoURL);
      
      // Simpan rekomendasi
      await saveRecommendation(user.uid, {
        photoURL,
        faceShape,
        recommendations: getHaircutRecommendations(faceShape)
      });

      setRecommendation({
        photoURL,
        faceShape,
        recommendations: getHaircutRecommendations(faceShape)
      });
      setError('');
    } catch (err) {
      setError('Gagal memproses foto: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getHaircutRecommendations = (shape) => {
    const recommendations = {
      'oval': ['Undercut', 'Slick Back', 'Pompadour'],
      'round': ['Fade', 'High and Tight', 'Textured Crop'],
      'square': ['Side Part', 'Quiff', 'Buzz Cut'],
      'heart': ['Comb Over', 'Messy Fringe', 'Low Fade'],
      'diamond': ['Crew Cut', 'Spiked Hair', 'Modern Pompadour']
    };
    return recommendations[shape] || ['Consultasi dengan barber profesional'];
  };

  return (
    <div className="upload-container">
      <h2>Unggah Foto Wajah</h2>
      
      {error && <div className="error">{error}</div>}
      
      <input 
        type="file" 
        accept="image/*" 
        onChange={(e) => setFile(e.target.files[0])}
      />
      
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Memproses...' : 'Dapatkan Rekomendasi'}
      </button>

      {recommendation && (
        <div className="result">
          <img src={recommendation.photoURL} alt="Wajah" width="200" />
          <p>Bentuk Wajah: {recommendation.faceShape}</p>
          <h3>Rekomendasi Gaya Rambut:</h3>
          <ul>
            {recommendation.recommendations.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}