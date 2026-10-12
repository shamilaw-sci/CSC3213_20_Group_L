import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomeGateway from './pages/HomeGateway';
import StaffLogin from './pages/StaffLogin';
import StudentLogin from './pages/StudentLogin';
import ReceptionOPD from './pages/ReceptionOPD';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDesk from './pages/DoctorDesk';
import PharmacyDesk from './pages/PharmacyDesk';
import StudentPortal from './pages/StudentPortal';
import AnalyticsView from './pages/AnalyticsView';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('gateway'); // 'gateway', 'staff_login', 'student_login'
  const [activeTab, setActiveTab] = useState('reception');

  // Set default active tab based on role upon login
  useEffect(() => {
    if (user) {
      if (user.role === 'student' || user.role === 'staff_patient') {
        setActiveTab('student_portal');
      } else if (user.role === 'doctor') {
        setActiveTab('doctor');
      } else if (user.role === 'pharmacist') {
        setActiveTab('pharmacy');
      } else if (user.role === 'reception') {
        setActiveTab('reception');
      } else if (user.role === 'admin') {
        setActiveTab('reception');
      }
    } else {
      setCurrentView('gateway');
    }
  }, [user]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="brand-crest" style={{ margin: '0 auto 16px', width: '56px', height: '56px', fontSize: '1.6rem' }}>
            UoP
          </div>
          <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800 }}>
            University of Peradeniya
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Loading Health Centre Management System...
          </p>
        </div>
      </div>
    );
  }

  // If user is NOT logged in, show Gateway / Login screens
  if (!user) {
    if (currentView === 'staff_login') {
      return <StaffLogin onBack={() => setCurrentView('gateway')} onSuccess={() => {}} />;
    }
    if (currentView === 'student_login') {
      return <StudentLogin onBack={() => setCurrentView('gateway')} onSuccess={() => {}} />;
    }
    return <HomeGateway onSelectPortal={(portal) => setCurrentView(portal)} />;
  }

  // If user IS logged in, render authenticated dashboard with Navbar
  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {/* Student View */}
        {(user.role === 'student' || user.role === 'staff_patient') && (
          <StudentPortal />
        )}

        {/* Staff Views */}
        {user.role !== 'student' && user.role !== 'staff_patient' && (
          <>
            {activeTab === 'reception' && <ReceptionOPD />}
            {activeTab === 'admin' && <AdminDashboard />}
            {activeTab === 'doctor' && <DoctorDesk />}
            {activeTab === 'pharmacy' && <PharmacyDesk />}
            {activeTab === 'analytics' && <AnalyticsView />}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
