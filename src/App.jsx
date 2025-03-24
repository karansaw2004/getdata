import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [songAvatar, setSongAvatar] = useState(null);
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        e.target.value = null;
        return;
      }
      setSongAvatar(file);
    }
  };

  const handleSongChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'audio/mpeg') {
        alert('Please upload a valid MP3 file.');
        e.target.value = null;
        return;
      }
      setSong(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title) newErrors.title = 'Title is required';
    if (!artist) newErrors.artist = 'Artist name is required';
    if (!songAvatar) newErrors.songAvatar = 'Song avatar is required';
    if (!song) newErrors.song = 'Song file is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const upload = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('artist', artist);
    formData.append('songAvatar', songAvatar);
    formData.append('song', song);

    try {
      const response = await axios.post('https://spotifyreplicatry.onrender.com/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Upload successful:', response.data);
      alert('Upload successful!');
      setTitle('');
      setArtist('');
      setSongAvatar(null);
      setSong(null);
      setErrors({});
    } catch (error) {
      console.error('Error uploading data:', error);
      alert('Error uploading file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <form className="form" onSubmit={upload}>
        <h2>Upload Song</h2>

        <input
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          value={title}
        />
        {errors.title && <span className="error">{errors.title}</span>}

        <input
          type="text"
          onChange={(e) => setArtist(e.target.value)}
          placeholder="Artist Name"
          value={artist}
        />
        {errors.artist && <span className="error">{errors.artist}</span>}

        {/* Song Avatar Input */}
        <label htmlFor="songAvatar">Song Avatar:</label>
        <input
          id="songAvatar"
          type="file"
          onChange={handleImageChange}
          accept="image/*"
        />
        {errors.songAvatar && <span className="error">{errors.songAvatar}</span>}

        {/* Song Input */}
        <label htmlFor="song">Song (.mp3):</label>
        <input
          id="song"
          type="file"
          onChange={handleSongChange}
          accept=".mp3, .m4a"
        />
        {errors.song && <span className="error">{errors.song}</span>}

        <button type="submit" disabled={loading}>
          {loading ? <img src="/loading.gif" alt="Loading..." className="loading" /> : 'Submit'}
        </button>
      </form>
    </div>
  );
}

export default App;
