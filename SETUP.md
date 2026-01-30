# Local Development Setup Guide

## Prerequisites

- **Node.js** (v16+) - [Download](https://nodejs.org/)
- **MongoDB Atlas Account** (Free) - [Create Account](https://www.mongodb.com/cloud/atlas)
- **AssemblyAI API Key** (Free tier) - [Get Key](https://www.assemblyai.com/)
- **Git** (Optional) - [Download](https://git-scm.com/)

## Step 1: MongoDB Setup (5 minutes)

### Create MongoDB Database

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up with your email
3. Create a new project
4. Create a free tier cluster
5. Click **Connect** on your cluster
6. Choose **Drivers** → **Node.js**
7. Copy your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
   ```
   
### Whitelist Your IP

⚠️ **IMPORTANT**: MongoDB will block your connection until you whitelist your IP

1. Go to **Network Access** → **IP Whitelist**
2. Click **Add IP Address**
3. Click **Add Current IP Address** (or **Allow Access from Anywhere** for dev only)
4. Click **Confirm**

## Step 2: AssemblyAI API Key (2 minutes)

1. Go to [AssemblyAI](https://www.assemblyai.com/)
2. Sign up (free account)
3. Go to **Dashboard** → **API Key**
4. Copy your API key

## Step 3: Project Setup (5 minutes)

### Clone or Navigate to Project

```bash
cd /Users/ashminaik/Desktop/stt-web-app
```

### Backend Configuration

Create `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
ASSEMBLYAI_API_KEY=your_api_key_here
JWT_SECRET=your_secret_key_here_change_in_production
```

Install dependencies:
```bash
cd server
npm install
```

### Frontend Configuration

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Install dependencies:
```bash
cd client
npm install
```

## Step 4: Run the Application (2 minutes)

### Terminal 1 - Start Backend

```bash
cd /Users/ashminaik/Desktop/stt-web-app/server
node index.js
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 API URL: http://localhost:5000/api
```

### Terminal 2 - Start Frontend

```bash
cd /Users/ashminaik/Desktop/stt-web-app/client
npm run dev
```

You should see:
```
VITE v7.3.1 ready in xxx ms
➜  Local:   http://localhost:5173/
```

### Terminal 3 - Test Backend (Optional)

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-30T..."
}
```

## Step 5: Access the Application

Open your browser and go to:
```
http://localhost:5173
```

## Step 6: Test the Features

### 1. Register Account
- Click **Register** tab
- Enter email: `test@example.com`
- Enter password: `password123`
- Click **Register**

### 2. Record Audio
- Click **Record** tab
- Click **Start Recording**
- Say something (e.g., "Hello, this is a test")
- Click **Stop Recording**
- Click **Upload & Transcribe**
- Wait for the result (30-60 seconds)

### 3. Upload Audio File
- Click **Upload** tab
- Select an audio file (MP3, WAV, OGG, or WebM)
- Click **Upload & Transcribe**
- View the transcribed text

### 4. View History
- Scroll down on the right to see all transcriptions
- Click **Show more** to read full text
- Click **Download Text** to save as .txt file
- Click **Delete** to remove

## Troubleshooting

### MongoDB Connection Error
```
MongooseServerSelectionError: Could not connect to any servers
```

**Fix:**
1. Go to MongoDB Atlas → **Network Access**
2. Click **Add IP Address**
3. Click **Add Current IP Address**
4. Click **Confirm**
5. Restart backend with `node index.js`

### CORS Error in Browser Console
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:**
- Verify backend is running on `http://localhost:5000`
- Verify frontend .env has `VITE_API_URL=http://localhost:5000/api`
- Restart frontend with `npm run dev`

### "AssemblyAI API key is invalid"
```
Error: 401 Unauthorized
```

**Fix:**
1. Go to [AssemblyAI Dashboard](https://www.assemblyai.com/)
2. Copy your API key again
3. Update `server/.env` with correct key
4. Restart backend

### File Upload Shows "Only audio files allowed"
- Ensure file is MP3, WAV, OGG, or WebM
- Check file size (should be under 100MB)

### Microphone Permission Denied
- Grant browser permission to use microphone when prompted
- Check browser settings for microphone permissions

## Development Workflow

### Make Changes

Edit files in `client/src/` or `server/` folders:
- Changes to React files auto-reload (Frontend)
- Changes to server files require manual restart (Backend)

### Restart Backend
```
Press Ctrl+C to stop
node index.js  # to restart
```

### Restart Frontend
The dev server auto-reloads on file changes. If not:
```
Press Ctrl+C to stop
npm run dev  # to restart
```

## Common Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Database Inspection

### View Your Data in MongoDB

1. Go to MongoDB Atlas
2. Click your cluster
3. Click **Collections** tab
4. Browse your data:
   - `users` collection - registered accounts
   - `transcriptions` collection - transcripts and audio files

### Clear Database (if needed)

1. Go to MongoDB Atlas
2. Click your cluster
3. Click **Collections**
4. Select collection (e.g., `transcriptions`)
5. Click **Drop Collection**

## Need Help?

### Check Logs

**Backend logs:**
```bash
# Visible in terminal running "node index.js"
# Look for errors with 🔴 symbols
```

**Frontend logs:**
```bash
# Open browser DevTools (F12 or Cmd+Option+I)
# Click "Console" tab
# Look for red error messages
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| `Cannot find module 'mongoose'` | Run `npm install` in server folder |
| `Port 5000 already in use` | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| `Module not found: axios` | Run `npm install axios` in client folder |
| `ENOENT: no such file or directory` | Create `uploads` folder: `mkdir server/uploads` |

## Next Steps

- Explore the [README.md](./README.md) for full documentation
- Read [DEPLOYMENT.md](./DEPLOYMENT.md) when ready to deploy
- Customize the UI in `client/src/pages/` and `client/src/components/`
- Modify backend routes in `server/routes/`

## Success Indicators

✅ Backend running on port 5000  
✅ Frontend accessible at http://localhost:5173  
✅ Can register a new account  
✅ Can upload/record audio  
✅ Transcription appears after processing  
✅ Can view transcription history  

You're ready to develop! 🚀
