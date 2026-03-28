import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DineIn from './pages/DineIn';
import TableMap from './pages/TableMap';
import OnlineOrder from './pages/OnlineOrder';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dine-in" element={<ProtectedRoute><DineIn /></ProtectedRoute>} />
          <Route path="/table-map" element={<ProtectedRoute><TableMap /></ProtectedRoute>} />
          <Route path="/online-order" element={<ProtectedRoute><OnlineOrder /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;