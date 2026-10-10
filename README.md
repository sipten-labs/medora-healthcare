# MEDORA — Healthcare Experience Platform

MEDORA is a self-initiated, fictional healthcare appointment-platform portfolio demo. It includes a responsive React interface and an Express API. It is not a real clinic or medical service.

## What is included

- Patient overview dashboard and sample health records
- Doctor directory with search, specialty, and visit-type filters
- Fictional doctor profiles and appointment detail views
- Demo sign-in/register interface and a one-click interactive demo entry
- Appointment creation and cancellation demo flows
- Profile name update and contact-form validation
- Responsive mobile/tablet/desktop layouts, accessible labels, reduced-motion handling
- Express REST API and local development scripts
- Vercel Express entry point and build configuration

## Important privacy and demo notice

All doctors, ratings, appointments, health records, and account content are sample data. Do not enter real health information or use this project for actual care, diagnosis, treatment, or booking. The contact form validates the message but does not send email. This is a portfolio demo, not a production healthcare system.

The hosted demo uses temporary serverless-instance storage for sample state. New accounts and bookings are not guaranteed to persist across server restarts or serverless instances. No production database is connected. Before any real use, add a managed database, robust authentication/session management, rate limiting, audit logging, privacy review, and appropriate health-data/security safeguards.

## Deploy to Vercel via GitHub (no command line needed)

### 1. Download and extract

Download the `medora-deploy-ready.zip` package and choose **Extract All** or the WinRAR **Extract to...** option. Open the new extracted folder. At its top level you should see `package.json`, `index.js`, `vercel.json`, `client/`, and `server/`.

### 2. Create a new GitHub repository

1. Visit <https://github.com/new>.
2. Name the repository `medora-healthcare` and select **Public** (this is portfolio code).
3. Keep the repository empty: do not add another README, `.gitignore`, or license because these files are included in the project.
4. Click **Create repository**.

Do not upload MEDORA into the existing `savora-restaurant` repository; keep each portfolio project separate.

### 3. Upload the project files

1. On the new empty repository, choose **Add file → Upload files**.
2. On your computer open the extracted `medora-deploy-ready` folder in File Explorer.
3. Select the *contents* of that folder (root files plus the `client` and `server` folders) and drag them into GitHub's upload area. Do not upload the ZIP file itself, and do not upload the outer folder as an extra nested level.
4. Wait for the upload list to finish. Check that `package.json`, `index.js`, `vercel.json`, `client`, and `server` appear at the repository root.
5. Enter commit message `Add MEDORA healthcare platform` and click **Commit changes**.

If GitHub's browser uploader does not accept folders when dragged, stop and use GitHub Desktop or send a screenshot for alternate steps; do not upload only the root files because the app needs `client/` and `server/` too.

### 4. Import it into Vercel

1. Visit <https://vercel.com/new> and sign in.
2. Choose **Import Git Repository** and select `medora-healthcare` from your GitHub account. Approve GitHub access if asked.
3. Let Vercel detect the project as **Express**. The included `vercel.json` runs `npm run build`.
4. Keep the root directory as `./`. The install command should be `npm install`. The build command should be `npm run build`. Do not set a different root directory.
5. Click **Deploy** and wait for the build/deployment to finish.
6. Open the `.vercel.app` URL Vercel shows. The app should load. The built frontend is generated into `public/` and the Express API is the app entry point.

After the first successful deployment, each new commit to the connected GitHub branch triggers a new deployment automatically.

### 5. Test the live demo

1. Open the Vercel URL.
2. Choose **Explore interactive demo** on the sign-in screen; you do not need to create an account for the demo.
3. Try Find a doctor, specialty filters, doctor details, appointment booking, appointment list, and cancellation.
4. You can also visit `/api/health` on the same domain; it should return a small JSON health response.

If Vercel shows **Build Failed**, open the failed deployment's **Build Logs** and share a screenshot of the first red error block. Do not change random settings—diagnose the logged error first.

## Optional local development

You do not need to run the project locally to deploy it. If you later want to run it on your own computer, install Node.js 20.19+ or 22.12+ (current Node.js LTS recommended), then open a terminal in this folder and run `npm install` followed by `npm run dev`. The frontend opens at `http://127.0.0.1:5173` and proxies API calls to the Express server on port `4170`.

## Tech stack

- React + Vite
- Express REST API
- Lucide React icons
- Node.js crypto for demo password hashing and signed cookies
- Local JSON sample store for local development; temporary `/tmp` store when hosted in a serverless environment

## Project status

Self-initiated portfolio project. The UI and API source are included. This package was prepared for Vercel's Express deployment flow, but a successful cloud build has not been independently confirmed from this environment. If deployment fails, use the Vercel Build Logs to identify the specific error before changing configuration.
