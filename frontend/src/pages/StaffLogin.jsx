import React, { useState } from 'react';
import { Stethoscope, Lock, User, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StaffLogin = ({ onBack, onSuccess }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user.role === 'student') {
        setError('This portal is restricted to Medical Staff. Please use the Student Portal.');
      } else {
        onSuccess(user.role);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid staff credentials or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (u, p) => {
    setUsername(u);
    setPassword(p);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', padding: '20px' }}>
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
            <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
              <Stethoscope size={28} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)' }}>
              Medical Staff Console
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
              <label className="form-label form-label-required">Staff Username / Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. doctor1, pharmacist1, admin"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Enter your password"
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
              style={{ width: '100%', padding: '12px', marginTop: '12px' }}
            >
              <ShieldCheck size={18} />
              <span>{loading ? 'Authenticating...' : 'Sign In to Staff Console'}</span>
            </button>
          </form>

          {/* Quick preset buttons for demo */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '8px', textAlign: 'center' }}>
              PRESET DEMO ACCOUNTS:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('doctor1', 'password123')}
                style={{ fontSize: '0.75rem' }}
              >
                Dr. Dissanayake
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('pharmacist1', 'password123')}
                style={{ fontSize: '0.75rem' }}
              >
                Mr. Bandara (Pharmacy)
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('reception1', 'password123')}
                style={{ fontSize: '0.75rem' }}
              >
                Reception / OPD
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm" 
                onClick={() => handleQuickFill('admin', 'adminpassword')}
                style={{ fontSize: '0.75rem' }}
              >
                Administrator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffLogin;
