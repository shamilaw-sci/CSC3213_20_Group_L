import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  User, 
  AlertTriangle, 
  History, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  Calendar, 
  Pill, 
  CheckCircle,
  Building,
  Activity,
  BedDouble
} from 'lucide-react';
import { doctorService, pharmacyService, opdService } from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const COMMON_DIAGNOSES = [
  'Acute Gastritis / Dyspepsia',
  'Upper Respiratory Tract Infection (URTI)',
  'Viral Fever',
  'Tension Headache / Migraine',
  'Chicken Pox (Varicella)',
  'Allergic Rhinitis / Sinusitis',
  'Gastroenteritis / Loose Motion',
  'Exam Stress & Anxiety',
  'Musculoskeletal Back / Body Ache',
  'Contact Dermatitis / Skin Rash',
  'Bronchial Asthma Exacerbation'
];

const FREQUENCIES = [
  { value: 'tds', label: 'tds (3 times daily / පැය 8කට වරක්)' },
  { value: 'bd', label: 'bd (2 times daily / උදේ සවස)' },
  { value: 'nocte', label: 'nocte (At night / රාත්‍රියට පමණක්)' },
  { value: 'mane', label: 'mane (In the morning / උදේට පමණක්)' },
  { value: 'prn', label: 'prn (When required / අවශ්‍ය විටදී)' },
  { value: 'qds', label: 'qds (4 times daily / පැය 6කට වරක්)' }
];

const DoctorDesk = () => {
  const [queue, setQueue] = useState([]);
  const [activePatient, setActivePatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [medicinesList, setMedicinesList] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Consultation Form
  const [symptoms, setSymptoms] = useState('');
  const [examinationFindings, setExaminationFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  
  // Medical Leave Endorsement
  const [grantLeave, setGrantLeave] = useState(false);
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveDays, setLeaveDays] = useState(1);
  const [leaveReason, setLeaveReason] = useState('');

  // In-Patient / Ward Referral
  const [isAdmitted, setIsAdmitted] = useState(false);
  const [admittedWard, setAdmittedWard] = useState('Health Centre Ward');

  // Treatment Sheet (Prescription items)
  const [prescriptionItems, setPrescriptionItems] = useState([
    { medicine_id: '', dosage: '2 tabs', frequency: 'tds', duration: '3 days', quantity_prescribed: 18, instructions: 'After meals' }
  ]);
  const [specialInstructions, setSpecialInstructions] = useState('Drink plenty of water and rest.');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchDoctorQueue();
    fetchMedicines();
  }, []);

  const fetchDoctorQueue = async () => {
    setLoadingQueue(true);
    try {
      const res = await doctorService.getQueue();
      setQueue(res.data || []);
    } catch (e) {
      console.error('Queue error:', e);
    } finally {
      setLoadingQueue(false);
    }
  };

  const fetchMedicines = async () => {
    try {
      const res = await pharmacyService.getMedicines();
      setMedicinesList(res.data || []);
    } catch (e) {
      console.error('Medicines fetch error:', e);
    }
  };

  const handleSelectPatient = async (visit) => {
    setActivePatient(visit);
    setSuccessMsg('');
    
    // Reset form
    setSymptoms(visit.chief_complaint || '');
    setExaminationFindings('');
    setDiagnosis('');
    setClinicalNotes('');
    setGrantLeave(false);
    setIsAdmitted(false);
    setPrescriptionItems([
      { medicine_id: '', dosage: '2 tabs', frequency: 'tds', duration: '3 days', quantity_prescribed: 18, instructions: 'After meals' }
    ]);

    // Fetch patient history
    setLoadingHistory(true);
    try {
      const res = await doctorService.getPatientHistory(visit.patient_id);
      setPatientHistory(res.data);
    } catch (e) {
      console.error('History fetch error:', e);
    } finally {
      setLoadingHistory(false);
    }

    // Update status to IN_CONSULTATION if it was WAITING
    if (visit.status === 'WAITING') {
      try {
        await opdService.updateStatus(visit.visit_id, 'IN_CONSULTATION');
        fetchDoctorQueue();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddMedicineRow = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      { medicine_id: '', dosage: '1 tab', frequency: 'tds', duration: '3 days', quantity_prescribed: 9, instructions: 'After meals' }
    ]);
  };

  const handleRemoveMedicineRow = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...prescriptionItems];
    updated[index][field] = value;
    
    // Auto-calculate quantity if medicine, dosage, frequency, and duration are set
    if (field === 'duration' || field === 'frequency' || field === 'dosage') {
      const days = parseInt(updated[index].duration) || 3;
      let timesPerDay = 3;
      if (updated[index].frequency === 'bd') timesPerDay = 2;
      if (updated[index].frequency === 'nocte' || updated[index].frequency === 'mane') timesPerDay = 1;
      if (updated[index].frequency === 'qds') timesPerDay = 4;
      
      const numTabs = parseInt(updated[index].dosage) || 1;
      updated[index].quantity_prescribed = days * timesPerDay * numTabs;
    }

    setPrescriptionItems(updated);
  };

  const handleSubmitConsultation = async (e) => {
    e.preventDefault();
    if (!activePatient) return;
    if (!diagnosis.trim()) {
      alert('Please enter or select a diagnosis for this patient.');
      return;
    }

    setSaving(true);
    try {
      // Filter out empty prescription items
      const validItems = prescriptionItems
        .filter(item => item.medicine_id)
        .map(item => ({
          medicine_id: parseInt(item.medicine_id, 10),
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity_prescribed: parseInt(item.quantity_prescribed, 10) || 1,
          instructions: item.instructions
        }));

      const payload = {
        opd_visit_id: activePatient.visit_id,
        symptoms: symptoms,
        examination_findings: examinationFindings,
        diagnosis: diagnosis,
        clinical_notes: clinicalNotes,
        is_admitted: isAdmitted,
        admitted_ward: isAdmitted ? admittedWard : null,
        medical_leave_granted: grantLeave,
        leave_start_date: grantLeave ? leaveStartDate : null,
        leave_end_date: grantLeave ? leaveEndDate : null,
        leave_days: grantLeave ? parseInt(leaveDays, 10) : null,
        leave_reason: grantLeave ? (leaveReason || diagnosis) : null,
        prescription_items: validItems,
        special_instructions: specialInstructions
      };

      await doctorService.recordConsultation(payload);
      setSuccessMsg(`Consultation for ${activePatient.patient_name} recorded! Prescription forwarded to Pharmacy.`);
      setActivePatient(null);
      fetchDoctorQueue();
    } catch (e) {
      alert('Error recording consultation: ' + (e.response?.data?.detail || e.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
          Doctor Consultation & Treatment Desk
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time patient consultation, digital treatment sheet (Rx), and medical leave endorsements.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ marginBottom: '20px' }}>
          <CheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Main Grid: Left = Queue, Right = Consultation Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: activePatient ? '340px 1fr' : '1fr', gap: '20px' }}>
        
        {/* Left: Live Waiting Queue List */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ fontSize: '1.05rem' }}>
                <Stethoscope size={18} color="var(--primary)" />
                <span>Today's OPD Queue</span>
              </h3>
              <span className="card-subtitle">{queue.length} Patients in Waiting List</span>
            </div>
            <button 
              type="button" 
              onClick={fetchDoctorQueue} 
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 8px' }}
            >
              Refresh
            </button>
          </div>

          {loadingQueue ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Loading queue...
            </div>
          ) : queue.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No patients currently in the waiting list.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {queue.map((visit) => {
                const isSelected = activePatient && activePatient.visit_id === visit.visit_id;
                return (
                  <div
                    key={visit.visit_id}
                    onClick={() => handleSelectPatient(visit)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-light)'}`,
                      backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'var(--transition)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                        Token #{visit.token_number}
                      </span>
                      <Badge type={visit.status}>{visit.status === 'IN_CONSULTATION' ? 'Current' : 'Waiting'}</Badge>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--secondary)' }}>
                      {visit.patient_name}
                    </div>

                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {visit.patient_reg_no} | {visit.faculty || visit.hall_department || 'Student'}
                    </div>

                    {visit.allergies && (
                      <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 700 }}>
                        ⚠️ {visit.allergies}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Active Patient Consultation Workspace */}
        {activePatient ? (
          <div className="card">
            {/* Patient Header Banner */}
            <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-card-subtle)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span className="badge badge-primary" style={{ marginBottom: '4px' }}>
                    Token #{activePatient.token_number}
                  </span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>
                    {activePatient.patient_name}
                  </h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Reg No: <strong>{activePatient.patient_reg_no}</strong> | {activePatient.faculty} | Hall: {activePatient.hall_department} | Age: {activePatient.patient_age} Y ({activePatient.patient_gender})
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--secondary)' }}>
                    Blood Group: <span className="badge badge-info">{activePatient.blood_group || 'N/A'}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Visit Type: <Badge type={activePatient.visit_type}>{activePatient.visit_type}</Badge>
                  </div>
                </div>
              </div>

              {/* CRITICAL ALLERGY ALERT BANNER */}
              {activePatient.allergies ? (
                <div style={{ marginTop: '12px', padding: '10px 14px', borderRadius: 'var(--radius-sm)', backgroundColor: '#fee2e2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertTriangle size={18} color="var(--danger)" />
                  <strong style={{ color: '#991b1b', fontSize: '0.88rem' }}>
                    PATIENT ALLERGY ALERT: {activePatient.allergies}
                  </strong>
                </div>
              ) : (
                <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--success)', fontWeight: 600 }}>
                  ✓ No drug allergies on record
                </div>
              )}
            </div>

            {/* Consultation & Treatment Form */}
            <form onSubmit={handleSubmitConsultation}>
              
              {/* Section 1: Clinical Notes */}
              <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                1. Clinical Examination & Diagnosis
              </h4>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Presenting Symptoms & History</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="e.g. Fever for 2 days, sore throat, headache..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Examination Findings (BP, Pulse, Chest, etc.)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="e.g. BP 120/80, Pulse 78, Throat congested..."
                    value={examinationFindings}
                    onChange={(e) => setExaminationFindings(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Diagnosis</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    required
                    placeholder="Enter or select diagnosis..."
                    className="form-control"
                    style={{ flex: '1 1 300px' }}
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                  <select
                    className="form-control form-select"
                    style={{ flex: '1 1 240px' }}
                    onChange={(e) => {
                      if (e.target.value) setDiagnosis(e.target.value);
                    }}
                  >
                    <option value="">-- Quick Select Common Diagnosis --</option>
                    {COMMON_DIAGNOSES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Section 2: Treatment Sheet (Prescription) */}
              <h4 style={{ fontSize: '1rem', color: 'var(--primary)', margin: '24px 0 14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Pill size={18} />
                  <span>2. Treatment Sheet (Digital Prescription - Rx)</span>
                </div>
                <button 
                  type="button" 
                  onClick={handleAddMedicineRow} 
                  className="btn btn-outline btn-sm"
                >
                  <Plus size={14} /> Add Medicine
                </button>
              </h4>

              {prescriptionItems.map((item, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '2fr 1fr 1.5fr 1fr 1fr 1fr auto', 
                    gap: '8px', 
                    alignItems: 'center', 
                    marginBottom: '10px',
                    padding: '8px',
                    backgroundColor: '#fbfcfe',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Medicine</label>
                    <select
                      className="form-control form-select"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={item.medicine_id}
                      onChange={(e) => handleMedicineChange(idx, 'medicine_id', e.target.value)}
                    >
                      <option value="">-- Select Drug --</option>
                      {medicinesList.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} {m.is_low_stock ? '⚠️ (Low Stock)' : `(${m.stock_quantity} ${m.unit})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Dosage</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      placeholder="e.g. 2 tabs"
                      value={item.dosage}
                      onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Frequency</label>
                    <select
                      className="form-control form-select"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={item.frequency}
                      onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                    >
                      {FREQUENCIES.map(f => (
                        <option key={f.value} value={f.value}>{f.value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      placeholder="e.g. 3 days"
                      value={item.duration}
                      onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Qty</label>
                    <input
                      type="number"
                      className="form-control"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={item.quantity_prescribed}
                      onChange={(e) => handleMedicineChange(idx, 'quantity_prescribed', e.target.value)}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Instructions</label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                      value={item.instructions}
                      onChange={(e) => handleMedicineChange(idx, 'instructions', e.target.value)}
                    />
                  </div>

                  <div style={{ paddingTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicineRow(idx)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '6px 8px', color: 'var(--danger)' }}
                      title="Remove row"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}

              <div className="form-group" style={{ marginTop: '12px' }}>
                <label className="form-label">Special Pharmacy Instructions</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Take after meals, drink plenty of water"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                />
              </div>

              {/* Section 3: Medical Leave & Ward Referral */}
              <h4 style={{ fontSize: '1rem', color: 'var(--primary)', margin: '24px 0 14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
                3. Medical Certificate / Leave Endorsement & Ward Admission
              </h4>

              {/* Medical Leave Box */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: grantLeave ? '#fef3c7' : 'var(--bg-card-subtle)', marginBottom: '14px', border: '1px solid var(--border-light)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, color: grantLeave ? '#92400e' : 'var(--secondary)' }}>
                  <input
                    type="checkbox"
                    checked={grantLeave}
                    onChange={(e) => setGrantLeave(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Grant Medical Leave / Sick Leave (Endorsed for Faculty Excuse)</span>
                </label>

                {grantLeave && (
                  <div className="form-grid-3" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Leave Start Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Leave End Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={leaveEndDate}
                        onChange={(e) => setLeaveEndDate(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Number of Days</label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        className="form-control"
                        value={leaveDays}
                        onChange={(e) => setLeaveDays(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* In-Patient / Ward Box */}
              <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: isAdmitted ? '#fee2e2' : 'var(--bg-card-subtle)', marginBottom: '20px', border: '1px solid var(--border-light)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 700, color: isAdmitted ? '#991b1b' : 'var(--secondary)' }}>
                  <input
                    type="checkbox"
                    checked={isAdmitted}
                    onChange={(e) => setIsAdmitted(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>In-Patient Ward Admission / Hospital Referral</span>
                </label>

                {isAdmitted && (
                  <div className="form-grid" style={{ marginTop: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Admitted Ward / Hospital</label>
                      <select
                        className="form-control form-select"
                        value={admittedWard}
                        onChange={(e) => setAdmittedWard(e.target.value)}
                      >
                        <option value="Health Centre In-Patient Ward">Health Centre In-Patient Ward</option>
                        <option value="Teaching Hospital Peradeniya">Teaching Hospital Peradeniya</option>
                        <option value="National Hospital Kandy (General Hospital)">National Hospital Kandy</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                <button
                  type="button"
                  onClick={() => setActivePatient(null)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ padding: '12px 32px' }}
                >
                  <Save size={18} />
                  <span>{saving ? 'Recording Consultation...' : 'Complete & Send to Pharmacy'}</span>
                </button>
              </div>
            </form>

            {/* Patient Past Medical History Section */}
            {patientHistory && patientHistory.history && patientHistory.history.length > 0 && (
              <div style={{ marginTop: '36px', paddingTop: '20px', borderTop: '2px dashed var(--border-light)' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--secondary)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <History size={18} color="var(--primary)" />
                  <span>Past Consultations & Medical History ({patientHistory.history.length})</span>
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {patientHistory.history.map((h, idx) => (
                    <div key={idx} style={{ padding: '14px', borderRadius: 'var(--radius-md)', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <strong style={{ color: 'var(--primary)', fontSize: '0.95rem' }}>{h.diagnosis}</strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.date} | {h.doctor_name}</span>
                      </div>
                      
                      {h.symptoms && (
                        <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          <strong>Symptoms:</strong> {h.symptoms}
                        </p>
                      )}

                      {h.medical_leave_granted && (
                        <div style={{ marginBottom: '6px' }}>
                          <span className="badge badge-warning">
                            Medical Leave: {h.leave_days} days ({h.leave_start_date} to {h.leave_end_date})
                          </span>
                        </div>
                      )}

                      {h.prescription && h.prescription.items && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', backgroundColor: '#ffffff', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                          <strong>Prescribed:</strong> {h.prescription.items.map(i => `${i.medicine_name} (${i.dosage} ${i.frequency} x ${i.duration})`).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <Stethoscope size={48} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '16px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--secondary)' }}>No Patient Selected</h3>
            <p style={{ fontSize: '0.9rem', maxWidth: '400px', margin: '8px auto 0' }}>
              Please select a waiting patient from the OPD queue on the left to start clinical consultation and Treatment Sheet (Rx).
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDesk;
