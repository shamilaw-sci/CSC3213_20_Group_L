import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  UserPlus, 
  Search, 
  Users, 
  Building, 
  CheckCircle, 
  AlertCircle,
  Filter,
  Save
} from 'lucide-react';
import { patientService } from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const FACULTIES = [
  'Faculty of Science',
  'Faculty of Engineering',
  'Faculty of Medicine',
  'Faculty of Arts',
  'Faculty of Agriculture',
  'Faculty of Dental Sciences',
  'Faculty of Veterinary Medicine',
  'Faculty of Allied Health Sciences (AHS)',
  'Faculty of Management',
  'Postgraduate Institute / Non-Faculty Staff'
];

const RESIDENTIAL_HALLS = [
  'Sangamitta Hall (SM)',
  'Hilda Obeyesekere Hall',
  'Ramanathan Hall (RNH)',
  'James Peiris Hall',
  'Arunachalam Hall',
  'Akbar Nell Hall',
  'Marrs Hall',
  'Marcus Fernando Hall',
  'Lalith Athulathmudali Hall',
  'Non-Resident (NRS)',
  'University Staff Quarters / Department'
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('entry'); // 'entry' or 'directory'
  const [patients, setPatients] = useState([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState('');

  // Form State for Manual Data Entry
  const initialForm = {
    patient_type: 'student',
    reg_no: '',
    file_no: '',
    name: '',
    title: 'Mr',
    gender: 'M',
    age: '',
    faculty: 'Faculty of Science',
    hall_department: 'Non-Resident (NRS)',
    academic_year: '1st Year',
    phone_personal: '',
    phone_home: '',
    nic: '',
    home_address: '',
    emergency_contact: '',
    blood_group: 'Unknown',
    allergies: '',
    chronic_conditions: ''
  };

  const [formData, setFormData] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // View Details Modal
  const [viewingPatient, setViewingPatient] = useState(null);

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchPatients();
    }
  }, [activeTab, selectedFaculty]);

  const fetchPatients = async () => {
    setLoadingDirectory(true);
    try {
      const res = await patientService.getAll({
        search: searchQuery || undefined,
        faculty: selectedFaculty || undefined
      });
      setPatients(res.data || []);
    } catch (e) {
      console.error('Error fetching patients:', e);
    } finally {
      setLoadingDirectory(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPatients();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age, 10) : null,
      };

      const res = await patientService.register(payload);
      setSuccessMsg(`Successfully registered ${res.data.name} (${res.data.reg_no}) into Medical Center Directory!`);
      setFormData(initialForm);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to register patient record.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
          Medical Records & Student Data Entry
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manual onboarding of incoming physical paper forms & complete University health directory.
        </p>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeTab === 'entry' ? 'active' : ''}`}
          onClick={() => setActiveTab('entry')}
        >
          <UserPlus size={18} />
          <span>Manual Paper Form Entry</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => setActiveTab('directory')}
        >
          <Users size={18} />
          <span>Search Registered Directory</span>
        </button>
      </div>

      {/* Tab 1: Manual Paper Form Entry */}
      {activeTab === 'entry' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <FileSpreadsheet size={20} color="var(--primary)" />
                <span>Onboard New Student / Staff Paper Medical Form</span>
              </h3>
              <span className="card-subtitle">
                Enter details directly from the physical medical enrollment or staff registration sheet
              </span>
            </div>
          </div>

          {successMsg && (
            <div className="alert alert-success">
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit}>
            {/* Record Type */}
            <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-md)' }}>
              <label className="form-label" style={{ marginBottom: '8px' }}>Record Category:</label>
              <div style={{ display: 'flex', gap: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="patient_type"
                    value="student"
                    checked={formData.patient_type === 'student'}
                    onChange={handleInputChange}
                  />
                  <span>Undergraduate / Postgraduate Student</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                  <input
                    type="radio"
                    name="patient_type"
                    value="staff"
                    checked={formData.patient_type === 'staff'}
                    onChange={handleInputChange}
                  />
                  <span>University Staff Member</span>
                </label>
              </div>
            </div>

            {/* Section 1: Identification */}
            <h4 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
              1. Basic Identification
            </h4>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label form-label-required">
                  {formData.patient_type === 'student' ? 'Student Reg No (e.g. S/22/535)' : 'Staff ID / Emp No'}
                </label>
                <input
                  type="text"
                  name="reg_no"
                  required
                  placeholder="e.g. S/22/535 or Ag/24/FT/44"
                  className="form-control"
                  value={formData.reg_no}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Physical Medical File No</label>
                <input
                  type="text"
                  name="file_no"
                  placeholder="e.g. SCI/2022/535"
                  className="form-control"
                  value={formData.file_no}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">NIC Number</label>
                <input
                  type="text"
                  name="nic"
                  placeholder="e.g. 200112345678"
                  className="form-control"
                  value={formData.nic}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label form-label-required">Full Name (with initials)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    name="title"
                    className="form-control form-select"
                    style={{ width: '100px', flexShrink: 0 }}
                    value={formData.title}
                    onChange={handleInputChange}
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Miss">Miss</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Rev">Rev.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. B.J. M.S.M. Bandara"
                    className="form-control"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Gender & Age</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select
                    name="gender"
                    className="form-control form-select"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <option value="M">Male (M)</option>
                    <option value="F">Female (F)</option>
                  </select>
                  <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    className="form-control"
                    style={{ width: '90px' }}
                    value={formData.age}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: University Details */}
            <h4 style={{ fontSize: '1rem', color: 'var(--primary)', margin: '20px 0 14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
              2. Faculty & Residential Hall Details
            </h4>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label form-label-required">Faculty / Division</label>
                <select
                  name="faculty"
                  className="form-control form-select"
                  value={formData.faculty}
                  onChange={handleInputChange}
                >
                  {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label form-label-required">Hall of Residence / Dept</label>
                <select
                  name="hall_department"
                  className="form-control form-select"
                  value={formData.hall_department}
                  onChange={handleInputChange}
                >
                  {RESIDENTIAL_HALLS.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Academic Year / Batch</label>
                <input
                  type="text"
                  name="academic_year"
                  placeholder="e.g. 1st Year, 3rd Year"
                  className="form-control"
                  value={formData.academic_year}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Section 3: Clinical Alerts & Medical Baseline */}
            <h4 style={{ fontSize: '1rem', color: 'var(--primary)', margin: '20px 0 14px', borderBottom: '1px solid var(--border-light)', paddingBottom: '6px' }}>
              3. Clinical Alerts & Medical History
            </h4>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  name="blood_group"
                  className="form-control form-select"
                  value={formData.blood_group}
                  onChange={handleInputChange}
                >
                  <option value="Unknown">Unknown</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: 'var(--danger)' }}>Known Drug / Food Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  placeholder="e.g. Penicillin, Sulfa, Aspirin (or 'None')"
                  className="form-control"
                  style={{ borderColor: formData.allergies ? 'var(--danger)' : undefined }}
                  value={formData.allergies}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Chronic Conditions</label>
                <input
                  type="text"
                  name="chronic_conditions"
                  placeholder="e.g. Asthma, Diabetes, Hypertension"
                  className="form-control"
                  value={formData.chronic_conditions}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Personal Phone</label>
                <input
                  type="text"
                  name="phone_personal"
                  placeholder="e.g. +94771234567"
                  className="form-control"
                  value={formData.phone_personal}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Info</label>
                <input
                  type="text"
                  name="emergency_contact"
                  placeholder="e.g. Father: 0712345678"
                  className="form-control"
                  value={formData.emergency_contact}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px', gap: '12px' }}>
              <button 
                type="button" 
                onClick={() => setFormData(initialForm)} 
                className="btn btn-secondary"
              >
                Clear Form
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="btn btn-primary"
                style={{ padding: '12px 28px' }}
              >
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Patient Record to Database'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 2: Search Directory */}
      {activeTab === 'directory' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Users size={20} color="var(--primary)" />
                <span>University Health Centre - Patient Directory</span>
              </h3>
              <span className="card-subtitle">
                Search all registered students and staff members
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 240px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by Name, Reg No, NIC, or Hall..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ width: '220px' }}>
              <select
                className="form-control form-select"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
              >
                <option value="">All Faculties</option>
                {FACULTIES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary">
              <Search size={16} />
              <span>Search</span>
            </button>
          </form>

          {loadingDirectory ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Searching directory...
            </div>
          ) : patients.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No patients found matching your search.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Faculty</th>
                    <th>Hall / Dept</th>
                    <th>Blood Group</th>
                    <th>Allergies</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id}>
                      <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.reg_no}</td>
                      <td style={{ fontWeight: 600 }}>{p.name}</td>
                      <td>
                        <Badge type={p.patient_type === 'student' ? 'primary' : 'neutral'}>
                          {p.patient_type.toUpperCase()}
                        </Badge>
                      </td>
                      <td>{p.faculty || '-'}</td>
                      <td>{p.hall_department || '-'}</td>
                      <td>
                        <span className="badge badge-info">{p.blood_group || 'N/A'}</span>
                      </td>
                      <td>
                        {p.allergies ? (
                          <span style={{ color: 'var(--danger)', fontWeight: 700, fontSize: '0.82rem' }}>
                            ⚠️ {p.allergies}
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-light)' }}>None</span>
                        )}
                      </td>
                      <td>
                        <button 
                          type="button" 
                          onClick={() => setViewingPatient(p)}
                          className="btn btn-secondary btn-sm"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Patient Details Modal */}
      <Modal
        isOpen={!!viewingPatient}
        onClose={() => setViewingPatient(null)}
        title={viewingPatient ? `Patient Profile: ${viewingPatient.name}` : ''}
      >
        {viewingPatient && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.9rem' }}>
              <div><strong>Registration No:</strong> {viewingPatient.reg_no}</div>
              <div><strong>File No:</strong> {viewingPatient.file_no || 'N/A'}</div>
              <div><strong>Full Name:</strong> {viewingPatient.name}</div>
              <div><strong>Gender / Age:</strong> {viewingPatient.gender} / {viewingPatient.age} Y</div>
              <div><strong>Faculty:</strong> {viewingPatient.faculty || 'N/A'}</div>
              <div><strong>Hall / Dept:</strong> {viewingPatient.hall_department || 'N/A'}</div>
              <div><strong>NIC:</strong> {viewingPatient.nic || 'N/A'}</div>
              <div><strong>Personal Phone:</strong> {viewingPatient.phone_personal || 'N/A'}</div>
              <div><strong>Blood Group:</strong> {viewingPatient.blood_group || 'N/A'}</div>
              <div><strong>Academic Batch:</strong> {viewingPatient.academic_year || 'N/A'}</div>
            </div>

            <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-sm)', border: '1px solid #fecaca' }}>
              <strong style={{ color: 'var(--danger)' }}>Drug / Food Allergies:</strong>
              <p style={{ margin: '4px 0 0 0', color: '#991b1b', fontWeight: 600 }}>
                {viewingPatient.allergies || 'No known allergies reported.'}
              </p>
            </div>

            <div style={{ marginTop: '12px', padding: '12px', backgroundColor: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <strong>Chronic Medical Conditions:</strong>
              <p style={{ margin: '4px 0 0 0', color: 'var(--text-main)' }}>
                {viewingPatient.chronic_conditions || 'None reported.'}
              </p>
            </div>

            <div className="modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
              <button type="button" onClick={() => setViewingPatient(null)} className="btn btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;
