import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  PlusCircle, 
  Search, 
  Clock, 
  CheckCircle, 
  UserPlus, 
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { opdService, patientService } from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const ReceptionOPD = () => {
  const [registerLogs, setRegisterLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchRegNo, setSearchRegNo] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientError, setPatientError] = useState('');
  
  // Issue Token Form State
  const [visitType, setVisitType] = useState('FIRST');
  const [priority, setPriority] = useState('NORMAL');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  useEffect(() => {
    fetchRegisterLogs();
  }, []);

  const fetchRegisterLogs = async () => {
    setLoading(true);
    try {
      const res = await opdService.getPatientsRegister();
      setRegisterLogs(res.data || []);
    } catch (e) {
      console.error('Error fetching patients register:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientLookup = async (e) => {
    e.preventDefault();
    if (!searchRegNo.trim()) return;

    setPatientError('');
    setSelectedPatient(null);
    try {
      const res = await patientService.getByRegNo(searchRegNo.trim());
      setSelectedPatient(res.data);
      setIsModalOpen(true);
    } catch (e) {
      setPatientError(`Patient with Reg No '${searchRegNo}' not found. Please register them in the Directory first.`);
    }
  };

  const handleIssueToken = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIssuing(true);
    try {
      const res = await opdService.issueToken({
        reg_no: selectedPatient.reg_no,
        visit_type: visitType,
        priority: priority,
        chief_complaint: chiefComplaint || 'OPD Consultation'
      });
      
      setFeedbackMsg(`Token #${res.data.token_number} issued successfully for ${selectedPatient.name}!`);
      setIsModalOpen(false);
      setSelectedPatient(null);
      setSearchRegNo('');
      setChiefComplaint('');
      fetchRegisterLogs();
    } catch (e) {
      alert('Error issuing token: ' + (e.response?.data?.detail || e.message));
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div>
      {/* Header & Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
            University of Peradeniya - Patients' Register
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Daily OPD Triage, Token Issuance & Official Consultation Logbook
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="button" 
            onClick={fetchRegisterLogs} 
            className="btn btn-secondary"
            title="Refresh Logbook"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>{feedbackMsg}</span>
          </div>
          <button onClick={() => setFeedbackMsg('')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>Dismiss</button>
        </div>
      )}

      {/* Action Bar: Fast Token Issuance by Student Reg No */}
      <div className="card" style={{ marginBottom: '24px', backgroundColor: '#fcf2f6', borderColor: 'rgba(127, 17, 70, 0.2)' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <PlusCircle size={20} />
          <span>Issue Daily OPD Token</span>
        </h3>
        
        <form onSubmit={handlePatientLookup} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Student Reg No (e.g. S/22/535, M/24/130) or Staff ID..."
              value={searchRegNo}
              onChange={(e) => setSearchRegNo(e.target.value)}
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search size={16} />
            <span>Lookup & Issue Token</span>
          </button>
        </form>

        {patientError && (
          <div style={{ marginTop: '12px', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertTriangle size={16} />
            <span>{patientError}</span>
          </div>
        )}
      </div>

      {/* Daily Patients' Register Table (Digital replica of physical logbook) */}
      <div className="card">
        <div className="card-header">
          <div>
            <h3 className="card-title">
              <ClipboardList size={20} color="var(--primary)" />
              <span>Today's Patients' Register (OPD Logbook)</span>
            </h3>
            <span className="card-subtitle">
              Date: {new Date().toLocaleDateString('en-GB')} | Total entries today: {registerLogs.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading patients register...
          </div>
        ) : registerLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No patient visits recorded today yet. Issue a token above to start today's register.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>Patient Name</th>
                  <th>File / Reg No</th>
                  <th>Age</th>
                  <th>Sex</th>
                  <th>Hall / Department</th>
                  <th>Diagnosis</th>
                  <th>Visits</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {registerLogs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 800, color: 'var(--primary)', textAlign: 'center' }}>
                      #{log.token_number}
                    </td>
                    <td style={{ fontWeight: 700 }}>{log.patient_name}</td>
                    <td>
                      <span className="badge badge-neutral">{log.patient_reg_no}</span>
                    </td>
                    <td>{log.patient_age || '-'}</td>
                    <td>{log.patient_sex || '-'}</td>
                    <td>{log.hall_department || '-'}</td>
                    <td>
                      {log.diagnosis_summary ? (
                        <span style={{ fontWeight: 600, color: 'var(--secondary)' }}>{log.diagnosis_summary}</span>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Pending consultation</span>
                      )}
                    </td>
                    <td>
                      <Badge type={log.visit_type}>{log.visit_type}</Badge>
                    </td>
                    <td>
                      <Badge type={log.status}>{log.status.replace('_', ' ')}</Badge>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {log.remarks || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Confirm Token Issuance */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Daily OPD Token Issuance"
      >
        {selectedPatient && (
          <form onSubmit={handleIssueToken}>
            <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card-subtle)', marginBottom: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.88rem' }}>
                <div><strong>Patient:</strong> {selectedPatient.name}</div>
                <div><strong>Reg No:</strong> {selectedPatient.reg_no}</div>
                <div><strong>Faculty:</strong> {selectedPatient.faculty || 'N/A'}</div>
                <div><strong>Hall:</strong> {selectedPatient.hall_department || 'N/A'}</div>
                <div><strong>Age/Gender:</strong> {selectedPatient.age} Y / {selectedPatient.gender}</div>
                <div><strong>Blood Group:</strong> {selectedPatient.blood_group || 'Not recorded'}</div>
              </div>
              {selectedPatient.allergies && (
                <div style={{ marginTop: '8px', color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem' }}>
                  ⚠️ Allergies: {selectedPatient.allergies}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Visit Type</label>
              <select 
                className="form-control form-select"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value)}
              >
                <option value="FIRST">FIRST (First visit for this illness)</option>
                <option value="SUBS">SUBS (Subsequent / Follow-up visit)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                className="form-control form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent (High fever, acute pain)</option>
                <option value="EMERGENCY">Emergency (Chest pain, severe trauma, asthma attack)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Chief Complaint (Reason given at triage)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Fever x 2 days, Gastritis pain, Headache..."
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
              />
            </div>

            <div className="modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
              <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={issuing} className="btn btn-primary">
                {issuing ? 'Issuing...' : 'Generate & Issue Token'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default ReceptionOPD;
