# Fnma Auth (Vite + React + Ant Design)

This is a minimal scaffold implementing professional Login and Signup pages using Vite, React and Ant Design. It includes a Google Sign-In component (using `@react-oauth/google`) and a shared SCSS variables file for theming.

Quick start

1. Copy `.env.example` to `.env` and set `VITE_GOOGLE_CLIENT_ID`.
2. Install dependencies:

```powershell
cd "d:/Work/Google calender mcp"; npm install
```

3. Start dev server:

```powershell
npm run dev
```

Notes

- Replace `VITE_GOOGLE_CLIENT_ID` with your Google OAuth Client ID (web application) to enable Google sign-in.
- This scaffold provides UI and local handlers. Wire authentication to your backend as needed.
