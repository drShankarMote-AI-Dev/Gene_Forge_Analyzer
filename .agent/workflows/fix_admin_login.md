---
description: Fix Invalid Admin Credentials in Production
---

This workflow helps resolve the "Invalid admin credentials" error on the production (Render) environment.

## Prerequisites
- Access to the Render Dashboard (https://dashboard.render.com/)
- Basic familiarity with terminal commands

## Steps

1. **Verify Environment Variables**
   - Go to your Render Dashboard -> Select the Backend Service (`gene-forge-backend`).
   - Click on **Environment**.
   - Ensure the following variables are set:
     - `ADMIN_EMAIL`: Set to your admin email (e.g., `admin@geneforge.com`).
     - `ADMIN_PASSWORD`: **CRITICAL**. Ensure this is set to a known password. If it was set to "Generate", you might not know the value. change it to a specific strong password.
     - `FRONTEND_URL`: `https://gene-forge-analyzer.vercel.app`
     - `ALLOWED_ORIGINS`: `https://gene-forge-analyzer.vercel.app`

2. **Trigger a Redeploy**
   - Any change to Environment Variables will trigger a redeploy.
   - Wait for the deploy to finish.

3. **Verify Admin User Exists**
   - Access the health endpoint: `https://gene-forge-analyzer-ld7t.onrender.com/health`
   - Look for `"admin_configured": true` in the JSON response.
   - If it says `false`, the seeding failed. Proceed to step 4.

4. **Manually Reset Admin Password (If needed)**
   - If login still fails, access the **Shell** tab in your Render service dashboard.
   - Run the following command to manually reset the admin credentials:
     ```bash
     python apps/backend/admin.py reset --email admin@geneforge.com --password YourStrongPassword123!
     ```
   - You should see a success message: `SUCCESS: Account admin@geneforge.com is now a System Administrator...`

5. **Test Login**
   - Go to the Vercel frontend: https://gene-forge-analyzer.vercel.app/admin
   - Login with the email and password you just set.

## Troubleshooting
- **CORS Errors**: If you see network errors in the browser console, ensure `https://gene-forge-analyzer.vercel.app` is in `ALLOWED_ORIGINS` env var.
- **Cookie Issues**: Ensure your browser allows third-party cookies or try Incognito mode. The backend requires `SameSite=None; Secure` cookies which are correctly configured in the latest update.
