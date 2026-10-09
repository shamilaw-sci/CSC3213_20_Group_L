import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT Bearer token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('uop_medical_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 token expiry gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Only remove tokens if a protected request fails
      const url = error.config?.url || '';
      if (!url.includes('/auth/login') && !url.includes('/auth/demo-accounts') && !url.includes('/opd/queue')) {
        const token = localStorage.getItem('uop_medical_token');
        if (token) {
          localStorage.removeItem('uop_medical_token');
          localStorage.removeItem('uop_medical_user');
        }
      }
    }
    return Promise.reject(error);
  }
);

// API Service Endpoints
export const authService = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  getMe: () => api.get('/auth/me'),
  getDemoAccounts: () => api.get('/auth/demo-accounts'),
};

export const patientService = {
  getAll: (params) => api.get('/patients/', { params }),
  register: (patientData) => api.post('/patients/register', patientData),
  getByRegNo: (regNo) => api.get(`/patients/${encodeURIComponent(regNo)}`),
  update: (regNo, data) => api.put(`/patients/${encodeURIComponent(regNo)}`, data),
};

export const opdService = {
  issueToken: (data) => api.post('/opd/issue-token', data),
  getQueue: () => api.get('/opd/queue'),
  getPatientsRegister: (params) => api.get('/opd/patients-register', { params }),
  updateStatus: (visitId, status) => api.put(`/opd/status/${visitId}`, { status }),
};

export const doctorService = {
  getQueue: () => api.get('/doctor/queue'),
  getPatientHistory: (patientId) => api.get(`/doctor/patient-history/${patientId}`),
  recordConsultation: (data) => api.post('/doctor/consult', data),
  getMedicalLeaves: (params) => api.get('/doctor/medical-leaves', { params }),
};

export const pharmacyService = {
  getMedicines: (params) => api.get('/pharmacy/medicines', { params }),
  addMedicine: (data) => api.post('/pharmacy/medicines', data),
  updateMedicine: (id, data) => api.put(`/pharmacy/medicines/${id}`, data),
  getPendingPrescriptions: () => api.get('/pharmacy/prescriptions/pending'),
  dispense: (prescriptionId, remarks) => api.post('/pharmacy/dispense', { prescription_id: prescriptionId, remarks }),
  getLowStockAlerts: () => api.get('/pharmacy/low-stock-alerts'),
};

export const analyticsService = {
  getDailySummary: () => api.get('/analytics/daily-summary'),
};

export default api;
