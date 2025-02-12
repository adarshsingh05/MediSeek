// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
          
          
          </ul>
        </nav>

        <Routes>
          <Route path="/LandingPage" element={<LandingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
