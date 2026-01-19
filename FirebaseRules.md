
# 🔥 How to Fix: "Missing or insufficient permissions"

Firebase databases are locked by default. You must allow "Public Reads" for your visitors to see the notices.

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
  }
}
```
5. Click **Publish**.

### 2. Update Storage Rules
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

### 3. Enable Login
1. Click **Authentication** > **Sign-in method**.
2. Enable **Email/Password**.
3. Create an account in the **Users** tab for yourself.
