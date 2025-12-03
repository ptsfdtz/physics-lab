import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './experiments/Home';
import UniformMotionPage from './experiments/mechanics/kinematics/UniformMotion/index';

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mechanics/kinematics/uniform-motion" element={<UniformMotionPage />} />
          {/* Fallback for undeveloped routes */}
          <Route path="*" element={<div className="p-8 text-gray-500">Coming Soon...</div>} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
