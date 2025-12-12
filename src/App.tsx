import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

import { MainLayout } from '@/components';
import Home from '@/experiments/Home';
import ForceAnalysisPage from '@/experiments/mechanics/forces/ForceAnalysis';
import FreeFallPage from '@/experiments/mechanics/kinematics/FreeFall';
import ProjectilePage from '@/experiments/mechanics/kinematics/Projectile';
import UniformAccelerationPage from '@/experiments/mechanics/kinematics/UniformAcceleration';
import UniformMotionPage from '@/experiments/mechanics/kinematics/UniformMotion';

const App: React.FC = () => {
  return (
    <HashRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mechanics/kinematics/uniform-motion" element={<UniformMotionPage />} />
          <Route
            path="/mechanics/kinematics/uniform-acceleration"
            element={<UniformAccelerationPage />}
          />
          <Route path="/mechanics/kinematics/free-fall" element={<FreeFallPage />} />
          <Route path="/mechanics/kinematics/projectile" element={<ProjectilePage />} />
          <Route path="/mechanics/forces/force-analysis" element={<ForceAnalysisPage />} />
          {/* Fallback for undeveloped routes */}
          <Route path="*" element={<div className="p-8 text-gray-500">Coming Soon...</div>} />
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;
