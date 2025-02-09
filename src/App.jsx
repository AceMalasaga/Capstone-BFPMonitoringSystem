// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/pages/Dashboard';
import Login from './components/login/Login';
import History from './components/pages/History';
import Analytics from './components/pages/Analytics';
import Personnel from './components/pages/Personnel';
import Monitoring from './components/pages/Monitoring';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/monitoring" element={<Monitoring />} />
        <Route path="/history" element={<History />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/personnel" element={<Personnel />} />
      </Routes>
    </div>
  );
}

export default App;
