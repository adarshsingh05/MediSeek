// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Achievements from './Pages/Achievments';
import History from "./Pages/History";
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import VaultPage from './Pages/Vault';
import ChatWidget from './Pages/chatui';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
          
          
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/achievementsachievements" element={<Achievements />} />
          <Route path="/history" element={<History/>}></Route>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/dashboard" element={<Dashboard/>}></Route>
          <Route path="/vault" element={<VaultPage/>}></Route>
          <Route path="/chat" element={<ChatWidget/>}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
