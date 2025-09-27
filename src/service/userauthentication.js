import apiClient from './apiClient';
import { USER_AUTHENTICATION_ROUTE } from '../constant/route.constant';

const userAuthentication = {
    login: async (credentials) => {
        try {
            const response = await apiClient.post(USER_AUTHENTICATION_ROUTE.USER_LOGIN_ROUTE, credentials);

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

    checkUserEmail: async (email) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.CHECK_USER_EMAIL, { email });
    }, 
    
    register: async (userData) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.USER_SIGNUP_ROUTE, userData);
    },

    getMe: async () => {
        return await apiClient.get(USER_AUTHENTICATION_ROUTE.USER_ME);
    }, 

    forgetPasswordEmailCheck: async (email) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.PASSWORD_FORGOT_EMAIL_CHECK, { email });
    }

};

export default userAuthentication;
