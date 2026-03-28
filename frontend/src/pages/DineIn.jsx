import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DineIn = () => {
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAllocate = async () => {
    try {
      const res = await axios.post(`http://localhost:8080/api/tables/allocate?guests=${guests}`);
      setMessage(`Table ${res.data.tableNumber} allocated successfully!`);
      setTimeout(() => navigate('/table-map'), 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage(err.response.data);
      } else {
        setMessage(err.response?.data || 'An error occurred.');
      }
    }
  };

  const joinWaitlist = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
      const res = await axios.post(`http://localhost:8080/api/waitlist/join?name=${user.username}&guests=${guests}`);
      setMessage(`Added to waitlist! Estimated wait: ${res.data.estimatedWaitTimeMinutes} mins`);
    } catch (err) {
      setMessage('Failed to join waitlist.');
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/dashboard')} style={{ padding:'8px 16px', cursor:'pointer' }}>&larr; Back to Dashboard</button>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        <h2>Request a Table</h2>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', alignItems: 'center' }}>
          <label>Number of Guests:</label>
          <input 
            type="number" min="1" max="15" value={guests} 
            onChange={(e) => setGuests(e.target.value)} 
            style={{ padding: '8px', width: '80px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleAllocate} style={{ padding: '8px 16px', background: '#10b981', color:'white', border:'none', borderRadius:'4px', cursor: 'pointer' }}>
            Find Table
          </button>
        </div>

        {message && (
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ccc', width: '400px', textAlign: 'center' }}>
            <p>{message}</p>
            {message.includes('join waitlist') && (
              <button onClick={joinWaitlist} style={{ padding: '8px 16px', background: '#f59e0b', color:'white', border:'none', borderRadius:'4px', cursor: 'pointer', marginTop: '1rem' }}>
                Join Waitlist
              </button>
            )}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => navigate('/table-map')} style={{ padding: '8px 16px', background: '#6366f1', color:'white', border:'none', borderRadius:'4px', cursor: 'pointer' }}>
            View Floor Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default DineIn;
