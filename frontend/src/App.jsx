// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Achievements from './Pages/Achievments';
import History from "./Pages/History";

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
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/history" element={<History/>}></Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
