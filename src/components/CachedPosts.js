import React, { useState, useEffect, useMemo } from 'react';

const CachedPosts = () => {
  const [userId, setUserId] = useState(''); // Input to filter posts by userId
  const [allData, setAllData] = useState([]); // Stores full API response
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch only once
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json = await res.json();
        setAllData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Cached filtered data using useMemo
  const filteredPosts = useMemo(() => {
    if (!userId) return allData;
    return allData.filter(post => post.userId === parseInt(userId));
  }, [userId, allData]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Cached Posts Viewer</h1>

      <label>
        Filter by User ID:{" "}
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Leave blank to show all"
        />
      </label>

      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {!loading && !error && (
        <ul>
          {filteredPosts.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
            </li>
          ))}
          {filteredPosts.length === 0 && <p>No posts found for this user.</p>}
        </ul>
      )}
    </div>
  );
};

export default CachedPosts;
