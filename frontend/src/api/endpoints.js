import api from './axios';

export const getCategories = () => api.get('/categories/');
export const submitWork = (formData) => api.post('/submit/', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

export const login = (username, password) => api.post('/token/', { username, password });
export const getSubmissions = (params) => api.get('/submissions/', { params });
export const getSubmissionDetail = (id) => api.get(`/submissions/${id}/`);
export const deleteSubmission = (id) => api.delete(`/submissions/${id}/`);
export const getDashboardStats = () => api.get('/dashboard-stats/');
export const exportCSV = () => api.get('/export/csv/', { responseType: 'blob' });
export const exportExcel = () => api.get('/export/excel/', { responseType: 'blob' });