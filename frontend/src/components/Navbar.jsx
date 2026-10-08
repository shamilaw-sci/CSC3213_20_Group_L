import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Building2, 
  Stethoscope, 
  Pill, 
  Users, 
  ClipboardList, 
  BarChart3, 
  User, 
  LogOut, 
  Home,
  FileSpreadsheet
} from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const role = user.role;

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => setActiveTab(role === 'student' ? 'student_portal' : 'reception')}>
          <div className="brand-crest">
            <Building2 size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">University Health Centre</span>
            <span className="brand-subtitle">University of Peradeniya</span>
          </div>
        </div>

        <nav className="nav-links">
          {/* Staff & Clinicians Navigation */}
          {role !== 'student' && (
            <>
              {(role === 'admin' || role === 'reception') && (
                <>
                  <button 
                    className={`nav-item ${activeTab === 'reception' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reception')}
                  >
                    <ClipboardList size={17} />
                    <span>Patients' Register</span>
                  </button>
                  <button 
                    className={`nav-item ${activeTab === 'admin' ? 'active' : ''}`}
                    onClick={() => setActiveTab('admin')}
                  >
                    <FileSpreadsheet size={17} />
                    <span>Paper Records Entry</span>
                  </button>
                </>
              )}

              {(role === 'admin' || role === 'doctor') && (
                <button 
                  className={`nav-item ${activeTab === 'doctor' ? 'active' : ''}`}
                  onClick={() => setActiveTab('doctor')}
                >
                  <Stethoscope size={17} />
                  <span>Doctor Desk</span>
                </button>
              )}

              {(role === 'admin' || role === 'pharmacist') && (
                <button 
                  className={`nav-item ${activeTab === 'pharmacy' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pharmacy')}
                >
                  <Pill size={17} />
                  <span>Pharmacy & Stock</span>
                </button>
              )}

              <button 
                className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
                onClick={() => setActiveTab('analytics')}
              >
                <BarChart3 size={17} />
                <span>Reports & Analytics</span>
              </button>
            </>
          )}

          {/* Student Navigation */}
          {role === 'student' && (
            <button 
              className={`nav-item ${activeTab === 'student_portal' ? 'active' : ''}`}
              onClick={() => setActiveTab('student_portal')}
            >
              <User size={17} />
              <span>My Student Health Portal</span>
            </button>
          )}
        </nav>

        <div className="nav-user">
          <div className="user-badge">
            <div className="user-avatar">
              {user.fullName ? user.fullName.charAt(0) : 'U'}
            </div>
            <div className="user-info">
              <span className="user-name">{user.fullName || user.username}</span>
              <span className="user-role-label">
                {role === 'doctor' ? 'Medical Officer' : role === 'pharmacist' ? 'Pharmacist' : role === 'reception' ? 'Triage / Reception' : role === 'admin' ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>

          <button 
            type="button" 
            onClick={logout} 
            className="btn btn-secondary btn-sm"
            title="Log Out"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
