# Arviora Admin Panel

The Admin Panel frontend is a standalone React app under this folder. Its API uses the same `backend/` server as the public website; there is no separate Admin backend.

## Run locally

1. From the repository root, start the API:

   ```powershell
   cd backend
   npm install
   npm start
   ```

   The API listens on port 5000 by default and continues to use the existing `backend/.env` and `backend/uploads`.

2. In another terminal, from the repository root, install and start the Admin Panel:

   ```powershell
   cd Admin
   npm install
   npm start
   ```

3. Open `http://localhost:3001/login`. The Admin Panel calls the shared API at `http://localhost:5000/api` by default. Set `REACT_APP_API_URL` and `REACT_APP_BACKEND_URL` in `Admin/.env` when the backend uses a different URL.

## Analytics reports

Open **Analytics** from the Admin sidebar to report on messages, blogs, services, and testimonials. Choose an inclusive date range (up to 366 days), select metrics, and group the chart by day, week, or month. Report settings are saved in the browser, and results can be exported as CSV. Reports describe database records created during the selected period; they do not track website visitors or page views.

## Structure

- `src/admin/` - Admin screens and editor components
- `src/context/` - Admin authentication, theme, and data contexts
- `src/components/` - Shared UI components used by Admin forms

The API server starts with `backend/server.js`. It serves both the public website APIs and the Admin Panel APIs from one backend, using the existing routes, controllers, and models under `backend/`.
