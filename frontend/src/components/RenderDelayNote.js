import React from 'react';

const RenderDelayNote = () => (
  <div style={{
    background: 'rgba(255,243,205,0.35)',
    color: '#856404',
    padding: '8px 18px',
    borderRadius: 10,
    fontSize: 15,
    border: '1px solid #ffeeba',
    margin: '18px auto 0 auto',
    marginBottom: 0,
    width: '100%',
    maxWidth: 500,
    boxSizing: 'border-box',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)'
  }}>
    <strong>Note:</strong> Since the backend is deployed on the free tier of Render, your first response may be delayed as the server "wakes up." Subsequent responses should be much faster.
  </div>
);

export default RenderDelayNote; 