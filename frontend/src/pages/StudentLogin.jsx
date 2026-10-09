import React, { useState } from 'react';
import { GraduationCap, Lock, CreditCard, ArrowLeft, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentLogin = ({ onBack, onSuccess }) => {
  const { login } = useAuth();
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(regNo, password);
      onSuccess(user.role);
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid Student Registration No or password. (Default password: password123)');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (r, p) => {
    setRegNo(r);
    setPassword(p);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f9ff', padding: '20px' }}>
      <div style={{ maxWidth: '440px', width: '100%' }}>
        <button 
          onClick={onBack} 
          className="btn btn-secondary btn-sm" 
          style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <ArrowLeft size={16} /> Back to Gateway
        </button>

        <div className="card" style={{ padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <GraduationCap size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              Student & Patient Portal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              University of Peradeniya Health Centre
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label form-label-required">Student Registration No / Staff ID</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. S/22/535, M/24/130, E/20/328"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                />
                <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Enter your university faculty registration number
              </span>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Default password: password123"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '12px', backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}
            >
              <UserCheck size={18} />
              <span>{loading ? 'Logging in...' : 'Enter Student Portal'}</span>
            </button>
          </form>

          {/* Quick preset for student demo */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              DEMO STUDENTS:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('S/22/535', 'password123')}
                style={{ fontSize: '0.75rem' }}
              >
                S/22/535 (Science)
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('M/24/130', 'password123')}
                style={{ fontSize: '0.75rem' }}
              >
                M/24/130 (Medicine)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;
