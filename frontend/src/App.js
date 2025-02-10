// src/App.js
import React, { useState } from 'react';
import './App.css'; 

function App() {
  const [query, setQuery] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMedia = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/nasa-media?query=${query}`);
      const data = await response.json();
      setMedia(data.collection.items);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchMedia();
  };

  return (
    <div className="App">
      <h1>NASA Image and Video Library</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for NASA media"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      <div className="media-container">
        {media.length === 0 && !loading && !error && <p>No results found. Try searching!</p>}
        {media.map((item, index) => (
          <div key={index} className="media-item">
            {item.links && item.links[0] && item.links[0].href && (
              <img src={item.links[0].href} alt={item.data[0].title} className="media-image" />
            )}
            <p>{item.data[0].title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
