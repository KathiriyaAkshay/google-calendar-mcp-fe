import apiHandler from './apiHandler';

/**
 * User authentication service
 */
const userAuthentication = {
    /**
     * Login user
     * @param {Object} credentials - User credentials
     * @returns {Promise} - API response
     */
    login: async (credentials) => {
        try {
            const response = await apiHandler.post('/auth/login', credentials);

            // Store token in localStorage
            if (response && response.token) {
                localStorage.setItem('auth_token', response.token);

                // Store user info if available
                if (response.user) {
                    localStorage.setItem('user_info', JSON.stringify(response.user));
                }
            }

            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    },

    /**
     * Register new user
     * @param {Object} userData - User registration data
     * @returns {Promise} - API response
     */
    register: (userData) => {
        return apiHandler.post('/auth/register', userData);
    },

    /**
     * Logout user
     * @returns {void}
     */
    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        // Redirect to login page
        window.location.href = '/login';
    },

    /**
     * Check if user is authenticated
     * @returns {boolean} - Authentication status
     */
    isAuthenticated: () => {
        return !!localStorage.getItem('auth_token');
    },

    /**
     * Get current user info
     * @returns {Object|null} - User info
     */
    getUserInfo: () => {
        const userInfo = localStorage.getItem('user_info');
        return userInfo ? JSON.parse(userInfo) : null;
    },

    /**
     * Request password reset
     * @param {Object} data - Email data
     * @returns {Promise} - API response
     */
    requestPasswordReset: (data) => {
        return apiHandler.post('/auth/forgot-password', data);
    },

    /**
     * Reset password
     * @param {Object} data - Password reset data
     * @returns {Promise} - API response
     */
    resetPassword: (data) => {
        return apiHandler.post('/auth/reset-password', data);
    },

    /**
     * Refresh authentication token
     * @returns {Promise} - API response
     */
    refreshToken: async () => {
        try {
            const response = await apiHandler.post('/auth/refresh-token');

            if (response && response.token) {
                localStorage.setItem('auth_token', response.token);
            }

            return response;
        } catch (error) {
            console.error('Token refresh failed:', error);
            // If refresh fails, logout
            userAuthentication.logout();
            throw error;
        }
    },

    /**
     * Authenticate with Google
     * @returns {Promise} - API response
     */
    googleAuth: () => {
        // Redirect to Google OAuth endpoint
        window.location.href = `${process.env.REACT_APP_API_BASE_URL}/auth/google`;
    },

    /**
     * Handle Google OAuth callback
     * @param {string} code - Authorization code
     * @returns {Promise} - API response
     */
    handleGoogleCallback: async (code) => {
        try {
            const response = await apiHandler.post('/auth/google/callback', { code });

            if (response && response.token) {
                localStorage.setItem('auth_token', response.token);

                if (response.user) {
                    localStorage.setItem('user_info', JSON.stringify(response.user));
                }
            }

            return response;
        } catch (error) {
            console.error('Google authentication failed:', error);
            throw error;
        }
    },
};

export default userAuthentication;
