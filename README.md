# Secure Cloud File Vault

A cloud file storage system , where security and storage efficiency are the actual engineering problem not an afterthought bolted onto a generic upload/download app.

Most cloud storage platforms focus on convenience and hide how your data is actually protected. This project does the opposite: every file is encrypted before it reaches storage, every request is authenticated and role-checked, duplicate files are detected and never stored twice, and every meaningful action is logged.

## What it actually does

- Files are encrypted with AES-256-GCM before they ever touch storage, not after.
- Every upload is hashed with SHA-256. If the hash already exists, the file is referenced instead of stored again, one physical file in S3, however many users have it.
- Access is controlled with JWT auth and roles (user / admin). Ownership is checked server-side on every file request, not just hidden in the UI.
- Every upload, download, and delete is logged, including a filename snapshot taken at the time of the action, so the log stays accurate even if the file is later deleted.
- Admins can see total users, total storage used, and remove any file. Users can only manage their own.

## Stack

**Frontend:** Next.js, Tailwind CSS, Framer Motion
**Backend:** Node.js, Express
**Database:** MongoDB (Atlas)
**Auth:** JWT, bcrypt
**Encryption/Hashing:** Node's built-in `crypto` module (AES-256-GCM, SHA-256)
**Storage:** AWS S3

## Project structure

```
backend/
  middleware/authMiddleware.js   JWT verification + role gating
  models/                        User, File, ActivityLog schemas
  routes/
    authRoutes.js                register, login, /me
    fileroutes.js                upload, download, my-files, delete
    adminRoutes.js                users, storage-stats, logs, admin file delete
  utils/
    encryption.js                AES-256-GCM encrypt/decrypt
    s3.js                        upload/fetch from AWS S3
    logAction.js                 writes to the activity log
  server.js

frontend/
  src/app/                       landing, login, register, dashboard, admin
  src/components/                Sidebar, UploadDropzone, FileList, Preloader
  src/context/AuthContext.js     token/role state
  src/lib/api.js                 axios instance, auth header injection, 401 handling
```

## Running it locally

**Backend**
```
cd backend
npm install
```
Create a `.env` file:
```
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret
ENCRYPTION_KEY=your_32_byte_hex_key
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
S3_BUCKET_NAME=your_bucket_name
```
```
npm run dev
```

**Frontend**
```
cd frontend
npm install
npm run dev
```
Runs at `localhost:3000`, talks to the backend at `localhost:5000`.

## API routes

| Method | Route | Protected | Notes |
|---|---|---|---|
| POST | `/api/auth/register` | — | |
| POST | `/api/auth/login` | — | returns JWT + role |
| GET | `/api/auth/me` | token | |
| POST | `/api/files/upload` | token | encrypts, dedups, uploads |
| GET | `/api/files/download/:fileId` | token | owner or admin only |
| GET | `/api/files/my-files` | token | owner-scoped |
| DELETE | `/api/files/:fileId` | token | owner only |
| GET | `/api/admin/users` | admin | |
| GET | `/api/admin/storage-stats` | admin | |
| DELETE | `/api/admin/files/:fileId` | admin | |
| GET | `/api/admin/logs` | admin | |

## Status

Backend and frontend are both functional end to end - auth, encrypted upload/download, deduplication, RBAC, admin panel, and activity logging all work and have been tested manually through Postman/Hoppscotch and the UI.

**Not done yet:** Docker containerization and deployment.

## Why this project exists

Built for a course that explicitly asked for projects demonstrating real cloud computing concepts - not a to-do app deployed somewhere and called "cloud." This covers remote storage (S3), identity and access management (JWT/RBAC), security (AES encryption), and storage optimization (SHA-256 deduplication), with each one actually implemented, not just described.
