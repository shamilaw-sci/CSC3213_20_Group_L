import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Plus, 
  Package, 
  Clock, 
  RefreshCw, 
  Layers,
  Edit2
} from 'lucide-react';
import { pharmacyService } from '../services/api';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

const PharmacyDesk = () => {
  const [activeTab, setActiveTab] = useState('prescriptions'); // 'prescriptions' or 'inventory' or 'alerts'
  const [pendingPrescriptions, setPendingPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchMed, setSearchMed] = useState('');
  
  // Modals
  const [dispensingRx, setDispensingRx] = useState(null);
  const [dispensingLoading, setDispensingLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Add / Restock Medicine Modal
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [medFormData, setMedFormData] = useState({
    name: '',
    generic_name: '',
    category: 'Analgesic / Antipyretic',
    dosage_form: 'Tablet',
    strength: '',
    stock_quantity: 100,
    unit: 'tabs',
    min_stock_alert: 50,
    batch_number: '',
    supplier: 'SPMC'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'prescriptions') {
        const res = await pharmacyService.getPendingPrescriptions();
        setPendingPrescriptions(res.data || []);
      } else if (activeTab === 'inventory') {
        const res = await pharmacyService.getMedicines({ search: searchMed || undefined });
        setMedicines(res.data || []);
      }
      // Always refresh low-stock alerts count
      const alertsRes = await pharmacyService.getLowStockAlerts();
      setLowStockAlerts(alertsRes.data || []);
    } catch (e) {
      console.error('Error fetching pharmacy data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDispense = async (prescriptionId) => {
    setDispensingLoading(true);
    try {
      await pharmacyService.dispense(prescriptionId);
      setSuccessMsg(`Prescription #${prescriptionId} successfully dispensed! Inventory stock updated.`);
      setDispensingRx(null);
      fetchData();
    } catch (e) {
      alert('Dispense failed: ' + (e.response?.data?.detail || e.message));
    } finally {
      setDispensingLoading(false);
    }
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    try {
      if (editingMedicine) {
        await pharmacyService.updateMedicine(editingMedicine.id, medFormData);
        setSuccessMsg(`Medicine '${medFormData.name}' updated!`);
      } else {
        await pharmacyService.addMedicine(medFormData);
        setSuccessMsg(`New medicine '${medFormData.name}' added to inventory!`);
      }
      setIsAddMedModalOpen(false);
      setEditingMedicine(null);
      fetchData();
    } catch (e) {
      alert('Failed to save medicine: ' + (e.response?.data?.detail || e.message));
    }
  };

  const openEditMedicine = (med) => {
    setEditingMedicine(med);
    setMedFormData({
      name: med.name,
      generic_name: med.generic_name || '',
      category: med.category || 'General',
      dosage_form: med.dosage_form || 'Tablet',
      strength: med.strength || '',
      stock_quantity: med.stock_quantity,
      unit: med.unit,
      min_stock_alert: med.min_stock_alert,
      batch_number: med.batch_number || '',
      supplier: med.supplier || ''
    });
    setIsAddMedModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--secondary)', fontWeight: 800 }}>
            Pharmacy & Drug Dispensing Desk
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Live prescription dispensing, drug inventory tracking, and low-stock warnings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {lowStockAlerts.length > 0 && (
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => setActiveTab('alerts')}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <AlertTriangle size={16} />
              <span>{lowStockAlerts.length} Low Stock Alerts</span>
            </button>
          )}

          <button 
            type="button" 
            onClick={fetchData} 
            className="btn btn-secondary"
            title="Refresh"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="btn btn-secondary btn-sm" style={{ padding: '2px 8px' }}>Dismiss</button>
        </div>
      )}

      {/* Tabs */}
      <div className="tab-list">
        <button 
          className={`tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          <Clock size={18} />
          <span>Pending Prescriptions ({pendingPrescriptions.length})</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          <Layers size={18} />
          <span>Medicine Stock Inventory</span>
        </button>

        <button 
          className={`tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          <AlertTriangle size={18} color="var(--danger)" />
          <span style={{ color: lowStockAlerts.length > 0 ? 'var(--danger)' : undefined }}>
            Low Stock Alerts ({lowStockAlerts.length})
          </span>
        </button>
      </div>

      {/* Tab 1: Pending Prescriptions Queue */}
      {activeTab === 'prescriptions' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Pill size={20} color="var(--primary)" />
                <span>Live Prescriptions for Dispensing</span>
              </h3>
              <span className="card-subtitle">
                Incoming prescriptions from doctor consultation desks awaiting dispensing
              </span>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Loading pending prescriptions...
            </div>
          ) : pendingPrescriptions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              <CheckCircle size={40} color="var(--success)" style={{ opacity: 0.5, marginBottom: '12px' }} />
              <p>No pending prescriptions in queue. All prescriptions have been dispensed!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {pendingPrescriptions.map(rx => (
                <div 
                  key={rx.prescription_id} 
                  style={{ 
                    borderRadius: 'var(--radius-md)', 
                    border: '1px solid var(--border-light)', 
                    padding: '18px',
                    backgroundColor: '#ffffff',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.05rem' }}>
                        Rx #{rx.prescription_id}
                      </span>
                      <span className="badge badge-warning">Pending Dispense</span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--secondary)' }}>
                      {rx.patient_name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Reg No: <strong>{rx.patient_reg_no}</strong> | Prescribed by: {rx.doctor_name} at {rx.created_at}
                    </div>

                    {rx.patient_allergies && (
                      <div style={{ padding: '6px 10px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '12px' }}>
                        ⚠️ Patient Allergy: {rx.patient_allergies}
                      </div>
                    )}

                    <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '10px' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--secondary)', display: 'block', marginBottom: '6px' }}>
                        Prescribed Items ({rx.items.length}):
                      </strong>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {rx.items.map(item => (
                          <li 
                            key={item.item_id} 
                            style={{ 
                              fontSize: '0.85rem', 
                              backgroundColor: 'var(--bg-card-subtle)', 
                              padding: '6px 10px', 
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center'
                            }}
                          >
                            <div>
                              <strong>{item.medicine_name}</strong> - {item.dosage} ({item.frequency} x {item.duration})
                            </div>
                            <span className="badge badge-primary" style={{ fontWeight: 800 }}>
                              Qty: {item.quantity_prescribed} {item.unit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rx.special_instructions && (
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
                        Notes: {rx.special_instructions}
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--border-light)' }}>
                    <button
                      type="button"
                      onClick={() => handleDispense(rx.prescription_id)}
                      disabled={dispensingLoading}
                      className="btn btn-success"
                      style={{ width: '100%', padding: '10px' }}
                    >
                      <CheckCircle size={16} />
                      <span>{dispensingLoading ? 'Dispensing...' : 'Dispense & Deduct Stock'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Medicine Inventory */}
      {activeTab === 'inventory' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title">
                <Layers size={20} color="var(--primary)" />
                <span>Medicine Stock Inventory</span>
              </h3>
              <span className="card-subtitle">
                Available drug stocks, reorder thresholds, and suppliers
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                setEditingMedicine(null);
                setMedFormData({
                  name: '',
                  generic_name: '',
                  category: 'Analgesic',
                  dosage_form: 'Tablet',
                  strength: '',
                  stock_quantity: 100,
                  unit: 'tabs',
                  min_stock_alert: 50,
                  batch_number: '',
                  supplier: 'SPMC'
                });
                setIsAddMedModalOpen(true);
              }}
              className="btn btn-primary btn-sm"
            >
              <Plus size={16} />
              <span>Add New Medicine</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search medicine by name or generic category..."
              value={searchMed}
              onChange={(e) => setSearchMed(e.target.value)}
            />
            <button type="button" onClick={fetchData} className="btn btn-secondary">
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Drug Name</th>
                  <th>Category</th>
                  <th>Dosage Form</th>
                  <th>Strength</th>
                  <th>Stock Available</th>
                  <th>Min Alert Qty</th>
                  <th>Supplier</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map(m => (
                  <tr key={m.id}>
                    <td style={{ fontWeight: 700 }}>
                      {m.name}
                      {m.generic_name && (
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                          {m.generic_name}
                        </span>
                      )}
                    </td>
                    <td>{m.category || '-'}</td>
                    <td>{m.dosage_form}</td>
                    <td>{m.strength || '-'}</td>
                    <td style={{ fontWeight: 800, fontSize: '1rem', color: m.is_low_stock ? 'var(--danger)' : 'var(--secondary)' }}>
                      {m.stock_quantity} {m.unit}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{m.min_stock_alert} {m.unit}</td>
                    <td style={{ fontSize: '0.82rem' }}>{m.supplier || 'SPMC'}</td>
                    <td>
                      {m.is_low_stock ? (
                        <span className="badge badge-danger">⚠️ LOW STOCK</span>
                      ) : (
                        <span className="badge badge-success">In Stock</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => openEditMedicine(m)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                      >
                        <Edit2 size={14} />
                        <span>Restock / Edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Low Stock Alerts */}
      {activeTab === 'alerts' && (
        <div className="card">
          <div className="card-header">
            <div>
              <h3 className="card-title" style={{ color: 'var(--danger)' }}>
                <AlertTriangle size={20} />
                <span>Low Stock & Reorder Alert Center</span>
              </h3>
              <span className="card-subtitle">
                Medicines that have fallen below their safety threshold and require replenishment
              </span>
            </div>
          </div>

          {lowStockAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--success)' }}>
              <CheckCircle size={40} style={{ marginBottom: '12px' }} />
              <p style={{ fontWeight: 700 }}>All medicine stocks are within safe levels. No shortages!</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Medicine</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Safety Threshold</th>
                    <th>Deficit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockAlerts.map(m => (
                    <tr key={m.id}>
                      <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{m.name}</td>
                      <td>{m.category}</td>
                      <td style={{ fontWeight: 800, color: 'var(--danger)' }}>{m.stock_quantity} {m.unit}</td>
                      <td>{m.min_stock_alert} {m.unit}</td>
                      <td style={{ color: 'var(--warning)', fontWeight: 700 }}>
                        -{m.min_stock_alert - m.stock_quantity} {m.unit}
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => {
                            const found = medicines.find(med => med.id === m.id) || m;
                            openEditMedicine(found);
                          }}
                          className="btn btn-primary btn-sm"
                        >
                          Restock Batch Now
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

      {/* Add / Edit Medicine Modal */}
      <Modal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        title={editingMedicine ? `Restock / Edit: ${editingMedicine.name}` : 'Add New Medicine to Pharmacy'}
      >
        <form onSubmit={handleSaveMedicine}>
          <div className="form-group">
            <label className="form-label form-label-required">Medicine Trade Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Paracetamol 500mg, Omeprazole 20mg"
              className="form-control"
              value={medFormData.name}
              onChange={(e) => setMedFormData({ ...medFormData, name: e.target.value })}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Generic Name</label>
              <input
                type="text"
                placeholder="e.g. Paracetamol"
                className="form-control"
                value={medFormData.generic_name}
                onChange={(e) => setMedFormData({ ...medFormData, generic_name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                placeholder="e.g. Antibiotic, Analgesic, Antacid"
                className="form-control"
                value={medFormData.category}
                onChange={(e) => setMedFormData({ ...medFormData, category: e.target.value })}
              />
            </div>
          </div>

          <div className="form-grid-3">
            <div className="form-group">
              <label className="form-label">Dosage Form</label>
              <select
                className="form-control form-select"
                value={medFormData.dosage_form}
                onChange={(e) => setMedFormData({ ...medFormData, dosage_form: e.target.value })}
              >
                <option value="Tablet">Tablet</option>
                <option value="Capsule">Capsule</option>
                <option value="Syrup">Syrup</option>
                <option value="Ointment">Ointment / Cream</option>
                <option value="Inhaler">Inhaler</option>
                <option value="Sachet">Sachet</option>
                <option value="Injection">Injection</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Stock Quantity</label>
              <input
                type="number"
                required
                min="0"
                className="form-control"
                value={medFormData.stock_quantity}
                onChange={(e) => setMedFormData({ ...medFormData, stock_quantity: parseInt(e.target.value, 10) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label form-label-required">Min Alert Threshold</label>
              <input
                type="number"
                required
                min="1"
                className="form-control"
                value={medFormData.min_stock_alert}
                onChange={(e) => setMedFormData({ ...medFormData, min_stock_alert: parseInt(e.target.value, 10) || 10 })}
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Batch Number</label>
              <input
                type="text"
                placeholder="e.g. B2409"
                className="form-control"
                value={medFormData.batch_number}
                onChange={(e) => setMedFormData({ ...medFormData, batch_number: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Supplier / Source</label>
              <input
                type="text"
                placeholder="e.g. SPMC, MSD Sri Lanka, Local"
                className="form-control"
                value={medFormData.supplier}
                onChange={(e) => setMedFormData({ ...medFormData, supplier: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ margin: '24px -24px -24px', padding: '16px 24px' }}>
            <button type="button" onClick={() => setIsAddMedModalOpen(false)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMedicine ? 'Update Medicine Stock' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PharmacyDesk;
