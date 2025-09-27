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

    verifyEmail: async (data) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.VERIFY_EMAIL, data);
    },

    forgetPasword: async (data) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.PASSWORD_RESET, data);
    }, 

    setNewPassword: async (data) => {
        return await apiClient.post(USER_AUTHENTICATION_ROUTE.PASSWORD_CHANGE, data);
    }, 

    googleAuthRedirectURL: async () => {
        return await apiClient.get(USER_AUTHENTICATION_ROUTE.GOOGLE_AUTH_REDIRECT_URL);
    }

};

export default userAuthentication;
