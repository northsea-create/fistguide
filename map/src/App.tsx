import React, { useState, useEffect } from 'react';
import { SetupPage } from './pages/SetupPage';
import { DashboardPage } from './pages/DashboardPage';
import { GuidePage } from './pages/GuidePage';
import { UserProfile, DailyMealPlan, AppPage } from './types';
import { calculateMealPlan } from './utils/calculations';
import { saveUserProfile, loadUserProfile, clearUserProfile } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>('setup');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [mealPlan, setMealPlan] = useState<DailyMealPlan | null>(null);

  // Load existing profile on app start
  useEffect(() => {
    const savedProfile = loadUserProfile();
    if (savedProfile) {
      setUserProfile(savedProfile);
      setMealPlan(calculateMealPlan(savedProfile));
      setCurrentPage('dashboard');
    }
  }, []);

  const handleProfileComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    const calculatedPlan = calculateMealPlan(profile);
    setMealPlan(calculatedPlan);
    saveUserProfile(profile);
    setCurrentPage('dashboard');
  };

  const handleReset = () => {
    setUserProfile(null);
    setMealPlan(null);
    clearUserProfile();
    setCurrentPage('setup');
  };

  const handleShowGuide = () => {
    setCurrentPage('guide');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  if (currentPage === 'setup') {
    return <SetupPage onComplete={handleProfileComplete} />;
  }

  if (currentPage === 'guide') {
    return <GuidePage onBack={handleBackToDashboard} />;
  }

  if (currentPage === 'dashboard' && userProfile && mealPlan) {
    return (
      <DashboardPage
        profile={userProfile}
        mealPlan={mealPlan}
        onReset={handleReset}
        onShowGuide={handleShowGuide}
      />
    );
  }

  // Fallback - shouldn't reach here in normal flow
  return <SetupPage onComplete={handleProfileComplete} />;
}

export default App;