import { useMutation } from '@tanstack/react-query';
import userAuthentication from '../service/userAuthentication';

/**
 * Custom hook for user registration mutation
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object
 */
export const useRegisterMutation = (options = {}) => {
  return useMutation({
    mutationFn: (userData) => userAuthentication.register(userData),
    ...options
  });
};

/**
 * Custom hook for user login mutation
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object
 */
export const useLoginMutation = (options = {}) => {
  return useMutation({
    mutationFn: (credentials) => userAuthentication.login(credentials),
    ...options
  });
};

/**
 * Custom hook for Google authentication
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object
 */
export const useGoogleAuthMutation = (options = {}) => {
  return useMutation({
    mutationFn: (code) => userAuthentication.handleGoogleCallback(code),
    ...options
  });
};

/**
 * Custom hook for password reset request
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object
 */
export const usePasswordResetRequestMutation = (options = {}) => {
  return useMutation({
    mutationFn: (email) => userAuthentication.requestPasswordReset(email),
    ...options
  });
};

/**
 * Custom hook for password reset
 * @param {Object} options - Mutation options
 * @returns {Object} - Mutation object
 */
export const usePasswordResetMutation = (options = {}) => {
  return useMutation({
    mutationFn: (resetData) => userAuthentication.resetPassword(resetData),
    ...options
  });
};

