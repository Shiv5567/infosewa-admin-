
# 🔥 Firebase Configuration Guide

Firebase databases require specific security rules and indexes to function correctly.

### 1. Update Firestore Rules
1. Go to [Firebase Console](https://console.firebase.google.com/).
2. Select your project (**infosewa-44646**).
3. Click **Firestore Database** > **Rules** tab.
4. Replace the current code with this exactly:
```javascript
service cloud.firestore {
  match /databases/{database}/documents {
    match /notices/{noticeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /settings/{settingId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
5. Click **Publish**.

### 2. REQUIRED: Create Composite Index
**IMPORTANT:** The category filter requires a composite index to sort notices by date. Without this, category pages will show a "Synchronization failed" or "Permission" error.

1. **CLICK THIS LINK TO CREATE THE INDEX AUTOMATICALLY:**  
   [👉 Click here to create the required Firestore Index](https://console.firebase.google.com/v1/r/project/infosewa-44646/firestore/indexes?create_composite=Ck5wcm9qZWN0cy9pbmZvc2V3YS00NDY0Ni9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbm90aWNlcy9pbmRleGVzL18QARoMCghjYXRlZ29yeRABGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI)

2. **OR** do it manually:
   - Go to **Firestore Database** > **Indexes** tab.
   - Click **Add Index**.
   - Collection ID: `notices`
   - Field 1: `category` (Ascending)
   - Field 2: `createdAt` (Descending)
   - Query Scope: `Collection`
   - Click **Create Index**.
3. Status will be "Building" for a few minutes. Once it's "Enabled", your category pages will work perfectly.

### 3. Update Storage Rules
1. Click **Storage** > **Rules** tab.
2. Replace the current code with this exactly:
```javascript
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```
3. Click **Publish**.

### 4. Enable Login
1. Click **Authentication** > **Sign-in method**.
2. Enable **Email/Password**.
3. Create an account in the **Users** tab for yourself to access the Admin panel.
