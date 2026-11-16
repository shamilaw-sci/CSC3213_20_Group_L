import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Pill, 
  AlertTriangle, 
  TrendingUp, 
  GraduationCap, 
  Activity,
  RefreshCw
} from 'lucide-react';
import { analyticsService } from '../services/api';
import StatCard from '../components/StatCard';

const AnalyticsView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getDailySummary();
      setStats(res.data);
    } catch (e) {
      console.error('Analytics error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
        <Activity size={32} className="animate-spin" style={{ marginBottom: '12px', color: 'var(--primary)' }} />
        <p>Loading Health Centre analytics & clinical statistics...</p>
      </div>
    );
  }

  const maxDiagnosisCount = stats?.top_diagnoses?.length > 0 
    ? Math.max(...stats.top_diagnoses.map(d => d.count)) 
    : 1;

  const maxFacultyCount = stats?.faculty_distribution?.length > 0 
    ? Math.max(...stats.faculty_distribution.map(f => f.count)) 
    : 1;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
            Health Centre Clinical Reports & Analytics
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Daily OPD throughput, morbidity statistics, disease prevalence, and pharmacy consumption trends.
          </p>
        </div>

        <button 
          type="button" 
          onClick={fetchStats} 
          className="btn btn-secondary"
        >
          <RefreshCw size={16} />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total OPD Patients Today"
          value={stats?.total_today || 0}
          icon={<Users size={24} />}
          color="maroon"
        />

        <StatCard
          label="Waiting in Triage / Queue"
          value={stats?.waiting_today || 0}
          icon={<Clock size={24} />}
          color="amber"
        />

        <StatCard
          label="Treated & Completed"
          value={stats?.completed_today || 0}
          icon={<CheckCircle size={24} />}
          color="green"
        />

        <StatCard
          label="Prescriptions Dispensed"
          value={stats?.prescriptions_dispensed_today || 0}
          icon={<Pill size={24} />}
          color="blue"
        />
      </div>

      {/* Grid: Left = Top Diagnoses, Right = Faculty Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        
        {/* Card 1: Top Diagnoses & Morbidity Trends */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <TrendingUp size={20} color="var(--primary)" />
                <span>Prevalent Diagnoses & Clinical Trends</span>
              </h3>
              <span className="card-subtitle">
                Most frequent illness diagnoses recorded in OPD logbook
              </span>
            </div>
          </div>

          {stats?.top_diagnoses && stats.top_diagnoses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.top_diagnoses.map((item, idx) => {
                const percentage = Math.round((item.count / maxDiagnosisCount) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--secondary)' }}>{item.diagnosis}</span>
                      <strong style={{ color: 'var(--primary)' }}>{item.count} Cases</strong>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          backgroundColor: idx === 0 ? 'var(--primary)' : idx === 1 ? 'var(--accent)' : 'var(--warning)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.6s ease'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No diagnosis records recorded yet.
            </div>
          )}
        </div>

        {/* Card 2: Faculty Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <GraduationCap size={20} color="var(--accent)" />
                <span>Patient Distribution by Faculty</span>
              </h3>
              <span className="card-subtitle">
                Breakdown of students visiting the Health Centre by academic faculty
              </span>
            </div>
          </div>

          {stats?.faculty_distribution && stats.faculty_distribution.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {stats.faculty_distribution.map((item, idx) => {
                const percentage = Math.round((item.count / maxFacultyCount) * 100);
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.9rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{item.faculty}</span>
                      <strong style={{ color: 'var(--accent)' }}>{item.count} Students</strong>
                    </div>
                    <div style={{ height: '8px', width: '100%', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          height: '100%', 
                          width: `${percentage}%`, 
                          backgroundColor: 'var(--accent)',
                          borderRadius: 'var(--radius-full)',
                          transition: 'width 0.6s ease'
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No faculty visit distribution available yet.
            </div>
          )}
        </div>
      </div>

      {/* Card 3: Summary Ratios & Inventory Health */}
      <div className="card" style={{ backgroundColor: '#ffffff' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Activity size={20} color="var(--primary)" />
            <span>OPD Operational Summary & Pharmacy Alerts</span>
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>First vs Subsequent Visits Ratio</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--secondary)', marginTop: '6px' }}>
              {stats?.first_visits_count || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>First</span> / {stats?.subs_visits_count || 0} <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Follow-up</span>
            </div>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: stats?.low_stock_medicines_count > 0 ? '#fee2e2' : '#f0fdf4' }}>
            <span style={{ fontSize: '0.85rem', color: stats?.low_stock_medicines_count > 0 ? 'var(--danger)' : 'var(--success)', fontWeight: 700 }}>
              Pharmacy Low Stock Health
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: stats?.low_stock_medicines_count > 0 ? '#991b1b' : '#166534', marginTop: '6px' }}>
              {stats?.low_stock_medicines_count || 0} Medicines below threshold
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
