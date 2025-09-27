export let USER_AUTHENTICATION_ROUTE = {
    USER_SIGNUP_ROUTE: "/user/create",
    USER_LOGIN_ROUTE: "/user/login",
    PASSWORD_RESET: "/user/forget-password",
    PASSWORD_CHANGE: "/user/verify-forget-password",
    PASSWORD_FORGOT: "/auth/forgot-password", 
    VERIFY_EMAIL: "/user/verify-email",
    GOOGLE_AUTH_REDIRECT_URL: "/user/google-signup-redirect-url",
    CHECK_USER_EMAIL: "/user/check-email",
    USER_ME: "/user/me",
    PASSWORD_FORGOT_EMAIL_CHECK: "/user/check-forget-password-email",
}

export let INTEGRATION_ROUTE = {
    GOOGLE_CALENDAR_REDIRECT_URL: "/integration/calendar/redirect-url",
    GOOGLE_CALENDAR_TOKEN_URL: "/integration/calendar/token",
    CONFIGURED_INTEGRATIONS: "/integration/configurations",
    DELETE_CONFIGURATION: "/integration/delete-configuration",
}