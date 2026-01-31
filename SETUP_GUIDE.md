# 🎙️ Speech-to-Text Web App - Setup & Usage Guide

## Project Status: ✅ COMPLETE & READY TO RUN

Your Speech-to-Text MERN application has been fully reconstructed with all necessary files, dependencies, and configurations.

---

## 📁 Project Structure

```
stt-web-app/
│
├── server/                          # Backend (Express.js + MongoDB)
│   ├── models/
│   │   ├── User.js                 # User authentication model
│   │   └── Transcript.js           # Transcription data model
│   ├── routes/
│   │   ├── auth.js                 # Auth endpoints (register, login, me)
│   │   └── transcribe.js           # Transcription endpoints
│   ├── index.js                    # Main server file
│   ├── package.json                # Backend dependencies
│   ├── .env                        # Environment variables (already configured)
│   └── uploads/                    # Audio file storage
│
├── client/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── Auth.jsx                # Login/Register UI
│   │   ├── Auth.css
│   │   ├── Transcriber.jsx         # Record/Upload audio
│   │   ├── Transcriber.css
│   │   ├── TranscriptList.jsx      # View transcription history
│   │   └── TranscriptList.css
│   ├── App.jsx                     # Main app component
│   ├── App.css
│   ├── main.jsx                    # React entry point
│   ├── index.html                  # HTML template
│   ├── index.css                   # Global styles
│   ├── vite.config.js              # Vite configuration
│   ├── package.json                # Frontend dependencies
│   └── .env                        # Environment variables
│
├── README.md                        # Full documentation
├── SETUP_GUIDE.md                  # This file
├── start.sh                        # Startup script
└── .gitignore
```

---

## 🚀 Quick Start

### Option 1: Start Both Servers (Recommended)

```bash
# Make the startup script executable
chmod +x start.sh

# Run both servers
./start.sh
```

Then open:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5001/api

### Option 2: Start Servers Manually

#### Terminal 1 - Backend:
```bash
cd server
npm start
# Server runs on http://localhost:5001
```

#### Terminal 2 - Frontend:
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

---

## ⚙️ Environment Configuration

### Server (.env) - Already Configured ✅
```env
PORT=5001
MONGODB_URI=mongodb+srv://ashminaik14_db_user:HRxkS4rWDFIXjO7P@cluster0.yuwploi.mongodb.net/?appName=Cluster0&maxPoolSize=1
ASSEMBLYAI_API_KEY=b317d159723246c1a515b7de011b7f90
JWT_SECRET=supersecretkey
```

### Client (.env) - Already Configured ✅
```env
VITE_API_URL=http://localhost:5001/api
```

**⚠️ Important**: These environment variables are configured for local development. Before deploying:
1. Change JWT_SECRET to a strong random string
2. Use environment-specific MongoDB URIs
3. Ensure AssemblyAI API key has sufficient quota

---

## 📚 Features Included

### ✅ Authentication System
- User registration with email validation
- Secure password hashing (bcryptjs)
- JWT-based authentication
- Login/Logout functionality
- Protected API endpoints

### ✅ Audio Management
- Live microphone recording (MediaRecorder API)
- Audio file upload support
- Base64 audio encoding for transmission
- File validation and error handling

### ✅ Transcription Features
- Integration with AssemblyAI API
- Real-time transcription status tracking
- Confidence scores
- Support for multiple languages
- Asynchronous processing

### ✅ User Interface
- Modern gradient-based design
- Responsive layout (mobile-friendly)
- Real-time status updates
- Copy-to-clipboard functionality
- Expandable transcript cards
- Loading states and error messages

### ✅ Database Management
- MongoDB integration with Mongoose
- User data persistence
- Transcription history storage
- Audio URL tracking

---

## 🔑 Key Technologies

| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | v14+ |
| Frontend Framework | React | 18.2.0 |
| Build Tool | Vite | 4.3.9 |
| Backend Framework | Express.js | 4.18.2 |
| Database | MongoDB | Cloud (Atlas) |
| Database ODM | Mongoose | 7.0.0 |
| Authentication | JWT | 9.0.0 |
| Password Hashing | bcryptjs | 2.4.3 |
| HTTP Client | Axios | 1.4.0 |
| Speech-to-Text | AssemblyAI | 4.2.0 |

---

## 🔄 Data Flow

```
User Interface (React)
        ↓
  Axios HTTP Request
        ↓
Express.js Server
        ↓
JWT Verification
        ↓
Database Query/Update (MongoDB)
        ↓
AssemblyAI API Call (for transcription)
        ↓
Save Results to Database
        ↓
Return Response to Frontend
        ↓
Display Results in UI
```

---

## 📊 API Endpoints Reference

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login user | No |
| GET | `/me` | Get current user | Yes |

**Request Examples:**

```javascript
// Register
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}

// Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

### Transcription Routes (`/api/transcribe`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|----------------|
| POST | `/upload` | Upload audio & start transcription | Yes |
| GET | `/list` | Get user's transcriptions | Yes |
| GET | `/:id` | Get specific transcript | Yes |
| DELETE | `/:id` | Delete transcript | Yes |

**Request Examples:**

```javascript
// Upload & Transcribe
POST /api/transcribe/upload
Headers: { Authorization: "Bearer <token>" }
{
  "audio": "data:audio/wav;base64,UklGRi4AAABXQVZFZm10IBAA...",
  "title": "My Recording"
}

// Get Transcripts List
GET /api/transcribe/list
Headers: { Authorization: "Bearer <token>" }
```

---

## 🗄️ Database Schemas

### User Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transcript Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (reference to User),
  title: String,
  audioUrl: String,
  text: String,
  duration: Number,
  language: String,
  status: String ("pending"|"processing"|"completed"|"failed"),
  confidence: Number (0-1),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛠️ Development Workflow

### Running Tests
```bash
# Currently no automated tests. To add:
cd server
npm install --save-dev jest
npm install --save-dev supertest

# Create test files in server/__tests__
```

### Building for Production

**Frontend:**
```bash
cd client
npm run build
# Creates optimized build in dist/ folder
```

**Backend:**
- No build step needed, runs directly with Node.js

### Code Quality
```bash
# Install ESLint
npm install --save-dev eslint

# Initialize ESLint
npx eslint --init

# Run linting
npx eslint .
```

---

## 🔒 Security Features Implemented

✅ Password Hashing
- Bcryptjs with 10 salt rounds
- Passwords never stored in plain text

✅ JWT Authentication
- 7-day token expiration
- Secure token signing with JWT_SECRET
- Token verification on protected routes

✅ Database Security
- MongoDB Atlas with IP whitelisting
- Connection string with credentials

✅ Input Validation
- Email format validation
- File type checking
- Required field validation

✅ CORS
- Enabled for frontend-backend communication
- Can be restricted to specific origins

---

## 🐛 Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
1. Verify MongoDB URI in server/.env
2. Check MongoDB Atlas IP whitelist includes your IP
3. Ensure network connection is active
4. Test connection: `node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(()=>console.log('✅ Connected'))"`

### Issue: AssemblyAI API Not Working
**Solution:**
1. Verify API key is correct in server/.env
2. Check AssemblyAI account has API quota remaining
3. Review AssemblyAI error logs
4. Test API key with: `curl -H "Authorization: <KEY>" https://api.assemblyai.com/v2/transcript`

### Issue: Microphone Access Denied
**Solution:**
1. Check browser microphone permissions
2. Try incognito mode
3. Check if HTTPS is used (required in production)
4. Try different browser
5. Restart browser

### Issue: Frontend Can't Reach Backend
**Solution:**
1. Verify backend is running on http://localhost:5001
2. Check VITE_API_URL in client/.env
3. Check browser console for CORS errors
4. Verify no firewall is blocking port 5001

### Issue: Files Not Saving to Database
**Solution:**
1. Verify MongoDB connection
2. Check database user has write permissions
3. Verify mongoose models are correctly defined
4. Check server logs for validation errors

---

## 📦 Dependencies Summary

### Backend (server/package.json)
```json
{
  "express": "^4.18.2",        // Web framework
  "mongoose": "^7.0.0",        // MongoDB ODM
  "cors": "^2.8.5",            // Cross-origin requests
  "dotenv": "^16.0.3",         // Environment variables
  "assemblyai": "^4.2.0",      // Speech-to-text API
  "jsonwebtoken": "^9.0.0",    // JWT authentication
  "bcryptjs": "^2.4.3"         // Password hashing
}
```

### Frontend (client/package.json)
```json
{
  "react": "^18.2.0",          // UI framework
  "react-dom": "^18.2.0",      // React DOM
  "axios": "^1.4.0",           // HTTP client
  "@vitejs/plugin-react": "^4.0.0",
  "vite": "^4.3.9"             // Build tool
}
```

---

## 🚀 Deployment Guide

### Deploy Backend (Render/Railway/Heroku)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables:
   - MONGODB_URI
   - ASSEMBLYAI_API_KEY
   - JWT_SECRET
   - PORT (auto-assigned)
4. Platform auto-deploys on push
5. Get backend URL (e.g., https://stt-api.render.com)

### Deploy Frontend (Netlify/Vercel)
1. Build frontend: `npm run build`
2. Connect repository to hosting platform
3. Update VITE_API_URL to deployed backend URL
4. Deploy
5. Frontend available at hosting platform URL

### Update Client for Production
In `client/.env`:
```env
VITE_API_URL=https://your-deployed-backend.com/api
```

---

## 📝 Next Steps

### Immediate (Get Running)
1. ✅ All dependencies installed
2. ✅ All files created
3. ✅ Environment configured
4. Run: `./start.sh` or start servers manually

### Short Term (Enhancements)
- [ ] Add email verification for registration
- [ ] Implement password reset functionality
- [ ] Add audio playback before transcription
- [ ] Support for multiple audio languages
- [ ] Export transcriptions as PDF/DOCX
- [ ] Share transcriptions with other users

### Medium Term (Features)
- [ ] Real-time transcription (live streaming)
- [ ] Automatic language detection
- [ ] Custom model training
- [ ] Team collaboration features
- [ ] Advanced search in transcriptions

### Long Term (Production)
- [ ] Automated testing (Jest, Supertest)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Performance monitoring
- [ ] Analytics dashboard
- [ ] Advanced security (2FA, OAuth)
- [ ] Mobile app (React Native)

---

## 📞 Support & Resources

### Documentation
- [README.md](./README.md) - Full project documentation
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Mongoose](https://mongoosejs.com)
- [AssemblyAI API](https://www.assemblyai.com/docs)
- [Vite Guide](https://vitejs.dev)

### Getting Help
- Check browser console for errors (F12)
- Review server logs in terminal
- Check GitHub issues
- Review error messages carefully

---

## ✨ Features Showcase

### Recording Audio
1. Click "🎤 Start Recording"
2. Grant microphone permission
3. Speak into microphone
4. Click "⏹️ Stop Recording"
5. Enter title and click "✨ Transcribe"

### Uploading Audio
1. Click "📁 Choose Audio File"
2. Select audio file from computer
3. Enter title and click "✨ Transcribe"
4. Wait for processing (check status)
5. View transcription in history

### Managing Transcriptions
1. View all transcriptions in history section
2. Click transcript to expand details
3. Copy text with "📋 Copy Text" button
4. Delete with "🗑️ Delete" button
5. Auto-refresh every 3 seconds

---

## 🎉 You're All Set!

Your Speech-to-Text application is fully reconstructed and ready to use. All components are in place, dependencies are installed, and environment variables are configured.

**Next Command:**
```bash
cd /Users/ashminaik/Desktop/stt-web-app
./start.sh
```

**Then visit:** http://localhost:3000

Happy transcribing! 🎙️✨

---

*Last Updated: January 31, 2026*
*Project: Speech-to-Text Web App (MERN Stack)*
