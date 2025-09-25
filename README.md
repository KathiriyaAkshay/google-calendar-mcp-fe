# Fnma Auth (Vite + React + Ant Design)

This is a minimal scaffold implementing professional Login and Signup pages using Vite, React and Ant Design. It includes a Google Sign-In component (using `@react-oauth/google`) and a shared SCSS variables file for theming.

Quick start

1. Copy `.env.example` to `.env` and set all required environment variables.
2. Install dependencies:

```powershell
cd "d:/Work/Google calender mcp"; npm install
```

3. Start dev server:

```powershell
npm run dev
```

## Environment Variables

This project requires the following environment variables in your `.env` file:

### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

### API Configuration
```
VITE_API_BASE_URL=your_api_base_url_here
```

### OAuth Configuration
```
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Notes

- Replace all environment variables with your actual values.
- Never commit your `.env` file to version control.
- This scaffold provides UI and local handlers. Wire authentication to your backend as needed.
