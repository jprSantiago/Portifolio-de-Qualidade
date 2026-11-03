import api from './api';

export const authService = {
    async register(data) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    async logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

    async getCurrentUser() {
        const response = await api.get('/users/me');
        return response.data;
    },

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    },
};

export default authService;
