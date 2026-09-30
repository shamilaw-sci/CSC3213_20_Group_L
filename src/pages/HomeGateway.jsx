import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  GraduationCap, 
  Building2, 
  ShieldCheck, 
  Activity, 
  Clock, 
  UserCheck, 
  Pill, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { opdService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HomeGateway = ({ onSelectPortal }) => {
  const { login } = useAuth();
  const [queue, setQueue] = useState([]);
  const [demoAccounts, setDemoAccounts] = useState([]);
  const [loadingDemo, setLoadingDemo] = useState(false);

  useEffect(() => {
    fetchLiveQueue();
    fetchDemoAccounts();
    const interval = setInterval(fetchLiveQueue, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveQueue = async () => {
    try {
      const res = await opdService.getQueue();
      setQueue(res.data || []);
    } catch (e) {
      console.error('Queue fetch error:', e);
    }
  };

  const fetchDemoAccounts = async () => {
    try {
      const res = await authService.getDemoAccounts();
      setDemoAccounts(res.data || []);
    } catch (e) {
      console.error('Demo accounts error:', e);
    }
  };

  const handleQuickDemo = async (account) => {
    setLoadingDemo(true);
    try {
      await login(account.username, account.password);
      // Auto switch portal based on role
      onSelectPortal(account.role === 'student' ? 'student' : 'staff');
    } catch (e) {
      alert('Quick login failed: ' + (e.response?.data?.detail || e.message));
    } finally {
      setLoadingDemo(false);
    }
  };

  const servingVisit = queue.find(v => v.status === 'IN_CONSULTATION');
  const waitingVisits = queue.filter(v => v.status === 'WAITING');

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
      {/* Top Banner */}
      <header style={{ borderBottom: '1px solid var(--border-light)', backgroundColor: '#ffffff', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="brand-crest">
              <Building2 size={26} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 800, margin: 0 }}>
                University of Peradeniya
              </h1>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, fontWeight: 600 }}>
                Health Centre Management & Clinical Care System
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
              <Activity size={14} /> Live System Online
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 20px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px' }}>
          <span className="badge badge-primary" style={{ marginBottom: '16px', padding: '6px 14px', fontSize: '0.85rem' }}>
            Official Health Centre Portal
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--secondary)', lineHeight: 1.2, marginBottom: '16px' }}>
            Digital Healthcare & Medical Records System
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Streamlining OPD consultations, digital prescriptions, medicine dispensing, and student medical records for the University community.
          </p>
        </div>

        {/* Dedicated Portals Selector Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px', marginBottom: '48px' }}>
          
          {/* Card 1: Medical Staff Portal */}
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', 
              border: '2px solid transparent', 
              transition: 'var(--transition)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => onSelectPortal('staff_login')}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Stethoscope size={28} />
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--secondary)' }}>
              Medical Staff & Clinicians
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              Dedicated console for Medical Officers, Chief Pharmacist, Nursing Officers, and Reception Staff.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--secondary-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" /> Doctor OPD Consultation & Digital Rx
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" /> Pharmacy Dispensing & Low-Stock Alerts
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} color="var(--primary)" /> Daily Patients' Register & Token Issuance
              </li>
            </ul>

            <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              <span>Enter Staff Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Card 2: Student & Patient Portal */}
          <div 
            className="card" 
            style={{ 
              cursor: 'pointer', 
              border: '2px solid transparent', 
              transition: 'var(--transition)' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => onSelectPortal('student_login')}
          >
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <GraduationCap size={28} />
            </div>
            
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--secondary)' }}>
              Student & Patient Portal
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: 1.5 }}>
              For University of Peradeniya undergraduates, postgraduates, and campus staff members.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', fontSize: '0.85rem', color: 'var(--secondary-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="var(--accent)" /> Live OPD Token Queue Tracking
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="var(--accent)" /> Personal Prescription & Treatment History
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={16} color="var(--accent)" /> Medical Leave Endorsement Status
              </li>
            </ul>

            <button className="btn btn-outline" style={{ width: '100%', padding: '12px', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
              <span>Enter Student Portal</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Live OPD Queue Quick Tracker */}
        <div className="card" style={{ marginBottom: '40px', backgroundColor: '#fcfbfd' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Today's Live OPD Queue Status</h3>
            </div>
            <span className="badge badge-info">{queue.length} Patients Today</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Currently in Consultation</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
                {servingVisit ? `Token #${servingVisit.token_number}` : 'Doctor Ready'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {servingVisit ? `${servingVisit.patient_name} (${servingVisit.patient_reg_no})` : 'Next patient will be called'}
              </span>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Waiting in Queue</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--warning)', marginTop: '4px' }}>
                {waitingVisits.length} Patients
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Estimated waiting time: ~{waitingVisits.length * 5} mins
              </span>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Completed Consultations</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)', marginTop: '4px' }}>
                {queue.filter(v => v.status === 'COMPLETED').length}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Treated & Prescriptions dispensed
              </span>
            </div>
          </div>
        </div>

        {/* 1-Click Demo Launcher (Ideal for Presentation / Supervisor Evaluation) */}
        <div className="card" style={{ border: '1px dashed var(--border-subtle)', backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Sparkles size={18} color="var(--primary)" />
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
              Quick Demo Accounts (1-Click Switcher for Testing & Evaluation)
            </h4>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Click any button below to instantly log in as that role without typing passwords:
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {demoAccounts.map((acc, idx) => (
              <button
                key={idx}
                type="button"
                disabled={loadingDemo}
                className="btn btn-secondary btn-sm"
                style={{ borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}
                onClick={() => handleQuickDemo(acc)}
              >
                {acc.role === 'doctor' && <Stethoscope size={14} color="var(--primary)" />}
                {acc.role === 'pharmacist' && <Pill size={14} color="var(--success)" />}
                {acc.role === 'reception' && <Building2 size={14} color="var(--accent)" />}
                {acc.role === 'admin' && <ShieldCheck size={14} color="var(--secondary)" />}
                {acc.role === 'student' && <GraduationCap size={14} color="var(--primary)" />}
                <span>{acc.label}</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomeGateway;
