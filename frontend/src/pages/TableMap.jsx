import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TableMap = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();

  const fetchTables = async () => {
    const res = await axios.get('http://localhost:8080/api/tables');
    setTables(res.data);
  };

  useEffect(() => {
    fetchTables();
    const interval = setInterval(fetchTables, 3000); // Poll every 3 seconds for updates
    return () => clearInterval(interval);
  }, []);

  const freeTable = async (id, e) => {
    e.stopPropagation();
    if(window.confirm("Are you sure you want to mark this table as FREE (simulate guests leaving)?")) {
      await axios.post(`http://localhost:8080/api/tables/free/${id}`);
      fetchTables();
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/dine-in')} style={{ padding:'8px 16px', cursor:'pointer', marginBottom: '1rem' }}>&larr; Back Support</button>
      <h2>Restaurant Floor Plan</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.5rem', marginTop: '2rem' }}>
        {tables.map(t => (
          <div 
            key={t.id}
            onClick={(e) => t.occupied && freeTable(t.id, e)}
            style={{
              padding: '1.5rem',
              borderRadius: '8px',
              textAlign: 'center',
              backgroundColor: t.occupied ? '#ef4444' : '#10b981',
              color: 'white',
              cursor: t.occupied ? 'pointer' : 'default',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Table {t.tableNumber}</div>
            <div>Capacity: {t.capacity}</div>
            <div style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
              {t.occupied ? 'Occupied (Click to Free)' : 'Available'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableMap;
