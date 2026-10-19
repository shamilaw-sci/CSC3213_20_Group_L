import React, { useState, useEffect } from 'react';
import { 
  User, 
  Clock, 
  Heart, 
  AlertTriangle, 
  History, 
  Calendar, 
  Pill, 
  CheckCircle,
  FileCheck2,
  RefreshCw,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { patientService, doctorService, opdService } from '../services/api';
import Badge from '../components/Badge';

const StudentPortal = () => {
  const { user } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentData();
    const interval = setInterval(fetchQueueOnly, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchStudentData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      // 1. Fetch patient profile
      const patientRes = await patientService.getByRegNo(user.username);
      const patient = patientRes.data;
      setPatientData(patient);

      // 2. Fetch medical history
      const histRes = await doctorService.getPatientHistory(patient.id);
      setHistoryData(histRes.data?.history || []);

      // 3. Fetch today's queue
      const queueRes = await opdService.getQueue();
      setQueue(queueRes.data || []);
    } catch (e) {
      console.error('Error fetching student portal data:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQueueOnly = async () => {
    try {
      const queueRes = await opdService.getQueue();
      setQueue(queueRes.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const currentServingVisit = queue.find(v => v.status === 'IN_CONSULTATION');
  const myTodayVisit = queue.find(v => v.patient_reg_no === user?.username);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
            Student Health & Clinical Portal
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Welcome, {user?.fullName || user?.username} ({user?.username})
          </p>
        </div>

        <button 
          type="button" 
          onClick={fetchStudentData} 
          className="btn btn-secondary"
        >
          <RefreshCw size={16} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Live OPD Queue Banner */}
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#f0f9ff', borderColor: '#bae6fd' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={20} color="var(--accent)" />
            <h3 style={{ fontSize: '1.15rem', color: '#0369a1', margin: 0, fontWeight: 700 }}>
              Live Health Centre OPD Queue
            </h3>
          </div>
          <span className="badge badge-info">Real-Time Monitor</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid #e0f2fe' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Currently in Consultation</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>
              {currentServingVisit ? `Token #${currentServingVisit.token_number}` : 'Doctor Ready'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {currentServingVisit ? `${currentServingVisit.patient_name}` : 'Next patient in queue'}
            </span>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid #e0f2fe' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>My Token Status Today</span>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: myTodayVisit ? 'var(--accent)' : 'var(--text-light)', marginTop: '4px' }}>
              {myTodayVisit ? `Token #${myTodayVisit.token_number}` : 'No Active Visit'}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {myTodayVisit ? (
                <Badge type={myTodayVisit.status}>{myTodayVisit.status.replace('_', ' ')}</Badge>
              ) : (
                'Visit reception triage to get a token'
              )}
            </span>
          </div>

          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid #e0f2fe' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Emergency Contact</span>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--secondary)', marginTop: '6px' }}>
              081 238 8152
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              24-Hour University Ambulance Service
            </span>
          </div>
        </div>
      </div>

      {/* Grid: Left = Medical Profile, Right = History & Leaves */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Left: Patient Profile Baseline */}
        {patientData && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <Heart size={18} color="var(--primary)" />
                <span>My Medical Record Profile</span>
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registration Number:</span>
                <strong>{patientData.reg_no}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Faculty:</span>
                <strong>{patientData.faculty || 'N/A'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Hall of Residence:</span>
                <strong>{patientData.hall_department || 'N/A'}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Blood Group:</span>
                <span className="badge badge-info">{patientData.blood_group || 'Not recorded'}</span>
              </div>

              {/* Allergy Alert */}
              <div style={{ marginTop: '8px', padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: patientData.allergies ? '#fee2e2' : '#f0fdf4', border: `1px solid ${patientData.allergies ? '#fecaca' : '#bbf7d0'}` }}>
                <strong style={{ color: patientData.allergies ? 'var(--danger)' : 'var(--success)', display: 'block', fontSize: '0.85rem' }}>
                  {patientData.allergies ? '⚠️ Known Allergies:' : '✓ Allergy Status:'}
                </strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: patientData.allergies ? '#991b1b' : '#166534' }}>
                  {patientData.allergies || 'No known drug allergies reported'}
                </p>
              </div>

              {patientData.chronic_conditions && (
                <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-card-subtle)' }}>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>Chronic Conditions:</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    {patientData.chronic_conditions}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right: Past Consultations & Prescriptions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <History size={18} color="var(--primary)" />
              <span>My Past Visits & Prescriptions</span>
            </h3>
            <span className="card-subtitle">{historyData.length} Records</span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              Loading history...
            </div>
          ) : historyData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
              No previous medical visits on record.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {historyData.map((item, idx) => (
                <div key={idx} style={{ padding: '16px', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong style={{ color: 'var(--primary)', fontSize: '1.05rem' }}>{item.diagnosis}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.date}</span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    Consulted with: <strong>{item.doctor_name}</strong>
                  </div>

                  {item.medical_leave_granted && (
                    <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', fontSize: '0.82rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <FileCheck2 size={16} />
                      <span>
                        Medical Leave Endorsed: {item.leave_days} Days ({item.leave_start_date} to {item.leave_end_date})
                      </span>
                    </div>
                  )}

                  {item.prescription && item.prescription.items && item.prescription.items.length > 0 && (
                    <div style={{ backgroundColor: 'var(--bg-card-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem' }}>
                      <strong style={{ display: 'block', color: 'var(--secondary)', marginBottom: '4px' }}>
                        Dispensed Medicines (Rx):
                      </strong>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {item.prescription.items.map((med, mIdx) => (
                          <li key={mIdx} style={{ padding: '2px 0' }}>
                            • {med.medicine_name} — {med.dosage} ({med.frequency} x {med.duration})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;
