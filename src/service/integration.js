import apiClient from './apiClient';
import { INTEGRATION_ROUTE } from '../constant/route.constant';

const integration = {
    getGoogleCalendarRedirectURL: async () => {
        return await apiClient.get(INTEGRATION_ROUTE.GOOGLE_CALENDAR_REDIRECT_URL);
    },
    getGoogleCalendarToken: async (token) => {
        return await apiClient.post(INTEGRATION_ROUTE.GOOGLE_CALENDAR_TOKEN_URL, { token });
    },

    configuredIntegrations: async () => {
        return await apiClient.get(INTEGRATION_ROUTE.CONFIGURED_INTEGRATIONS);
    }, 

    deleteConfiguration: async (integrationId) => {
        return await apiClient.post(INTEGRATION_ROUTE.DELETE_CONFIGURATION, { configuration_id : integrationId });
    }
}

export default integration;