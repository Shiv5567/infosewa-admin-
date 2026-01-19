
# 🚀 InfoSewa Cloudinary Integration Guide

To enable direct uploads from your Admin panel to Cloudinary, you must enable **Unsigned Uploads**.

### 1. Configure Cloudinary Console
1. Log in to your [Cloudinary Dashboard](https://cloudinary.com/).
2. Click the **Settings** (gear icon) at the bottom left.
3. Go to **Upload** tab.
4. Scroll down to **Upload presets** and click **"Add upload preset"**.
5. Change **Signing Mode** from "Signed" to **"Unsigned"**.
6. Note the **Upload preset name** (e.g., `infosewa_preset`). You can rename it.
7. Click **Save**.

### 2. Update Your App Code
1. Open `pages/Admin.tsx`.
2. Find the `CLOUDINARY_CONFIG` constants at the top.
3. Replace `'your_cloud_name'` with your actual **Cloud Name** (found on your Cloudinary dashboard homepage).
4. Replace `'infosewa_preset'` with the preset name you created in Step 1.

### 3. How it Works
- When you select a file in the Admin panel and click "Broadcast", the app sends the file directly to Cloudinary's servers.
- Cloudinary sends back a `secure_url`.
- The app then saves this URL into your **Firebase Firestore** database.
- Visitors see the image/PDF instantly from Cloudinary's fast Global CDN.

### 4. Why Cloudinary?
- **Speed**: Nepal users will get faster image loading.
- **Optimization**: Cloudinary automatically shrinks large images to save mobile data for your users.
- **PDF Hosting**: Reliable hosting for official government PDF documents.
