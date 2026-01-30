# Speech-to-Text Web Application

A full-stack **Speech-to-Text** web application built with the **MERN stack** (MongoDB, Express.js, React.js, Node.js), featuring audio upload/recording and transcription using **AssemblyAI** API.


//test
## 📚 Documentation

- **[Getting Started](./SETUP.md)** - Step-by-step local development setup
- **[Deployment Guide](./DEPLOYMENT.md)** - Deploy to Render, Netlify, Vercel, or Docker
- **[API Testing](./API-TESTING.md)** - Test API with cURL, Postman, or Node.js

## Features

- **🎤 Audio Recording**: Record audio directly from your browser's microphone
- **📁 Audio Upload**: Upload audio files (MP3, WAV, OGG, WebM)
- **✨ Automatic Transcription**: Convert audio to text using AssemblyAI API
- **👤 User Authentication**: Secure user accounts with JWT-based authentication
- **💾 Transcription History**: View, manage, and download all past transcriptions
- **📱 Responsive UI**: Beautiful Tailwind CSS design that works on all devices
- **🔒 Secure**: Password hashing with bcryptjs and JWT token-based auth

## Tech Stack

### Frontend
- **React.js** (v19) with Vite
- **Tailwind CSS** for styling
- **Axios** for API calls
- **MediaRecorder API** for audio recording

### Backend
- **Node.js** & **Express.js** (v5)
- **MongoDB** with Mongoose ODM
- **Multer** for file uploads
- **AssemblyAI** for speech-to-text transcription
- **JWT** for authentication
- **bcryptjs** for password hashing

### External APIs
- **AssemblyAI**: Speech-to-Text transcription service

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account (free tier available)
- AssemblyAI API key ([Get it here](https://www.assemblyai.com/))
- npm or yarn

### Installation

#### 1. Clone and Setup Project

```bash
cd /Users/ashminaik/Desktop/stt-web-app
```

#### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
JWT_SECRET=your_super_secret_jwt_key
```

**Get your credentials:**
- **MongoDB URI**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **AssemblyAI API Key**: [AssemblyAI Dashboard](https://www.assemblyai.com/)

#### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

#### Start Backend

```bash
cd server
node index.js
# or
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend

```bash
cd client
npm run dev
```

Frontend will run on `http://localhost:5173`

### Usage

1. **Register/Login**: Create a new account or login with existing credentials
2. **Record Audio**: Click the "Record" tab to record audio from your microphone
3. **Upload Audio**: Click the "Upload" tab to upload an existing audio file
4. **View Transcriptions**: Scroll through your transcription history on the right side
5. **Download Text**: Download any transcription as a `.txt` file
6. **Delete**: Remove transcriptions you no longer need

## API Documentation

### Authentication Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "_id": "...",
  "email": "user@example.com"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Transcription Endpoints

#### Upload & Transcribe Audio
```
POST /api/transcribe
Content-Type: multipart/form-data
Authorization: Bearer {token}

Form Data:
- audio: <audio_file>

Response: 200 OK
{
  "id": "...",
  "fileName": "recording.webm",
  "text": "Transcribed text here...",
  "createdAt": "2024-01-30T..."
}
```

#### Get All Transcriptions
```
GET /api/transcribe
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "_id": "...",
    "userId": "...",
    "fileName": "audio.mp3",
    "text": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

#### Delete Transcription
```
DELETE /api/transcribe/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Transcription deleted"
}
```

## Project Structure

```
stt-web-app/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx          # Login/Register page
│   │   │   └── TranscribeApp.jsx     # Main transcription app
│   │   ├── components/
│   │   │   ├── AudioUpload.jsx       # File upload component
│   │   │   ├── AudioRecorder.jsx     # Audio recording component
│   │   │   ├── TranscriptionList.jsx # List of transcriptions
│   │   │   └── TranscriptionCard.jsx # Individual transcription card
│   │   ├── App.jsx                   # Main app component
│   │   ├── App.css                   # App styling
│   │   ├── index.css                 # Tailwind CSS imports
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   ├── .env                          # Environment variables
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/
│   ├── routes/
│   │   ├── auth.js                   # Authentication routes
│   │   └── transcribe.js             # Transcription routes
│   ├── models/
│   │   ├── User.js                   # User schema
│   │   └── Transcription.js          # Transcription schema
│   ├── middleware/
│   │   └── auth.js                   # JWT authentication middleware
│   ├── uploads/                      # Uploaded audio files
│   ├── index.js                      # Server entry point
│   ├── package.json
│   └── .env                          # Environment variables
│
└── README.md
```

## Environment Variables

### Server (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/?appName=Cluster0` |
| `ASSEMBLYAI_API_KEY` | AssemblyAI API key | `abcdef123456` |
| `JWT_SECRET` | Secret key for JWT signing | `my-super-secret-key` |

### Client (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## Supported Audio Formats

- MP3 (audio/mpeg)
- WAV (audio/wav)
- OGG (audio/ogg)
- WebM (audio/webm)

## API Choices & Alternatives

### Current: AssemblyAI

**Pros:**
- High accuracy
- Fast processing
- Free tier available (100 minutes/month)
- Easy integration

**Cons:**
- Requires API key
- Limited free tier

### Other Options

#### 1. Google Cloud Speech-to-Text
```bash
npm install @google-cloud/speech
```
- Very accurate
- Pay-per-use pricing
- Supports 125+ languages

#### 2. OpenAI Whisper
```bash
npm install openai
```
- Excellent accuracy
- Affordable pricing
- Uses same API as ChatGPT

#### 3. Mozilla DeepSpeech (Open Source)
- Free and open source
- Self-hosted option
- Lower accuracy than commercial APIs

#### 4. Deepgram
```bash
npm install @deepgram/sdk
```
- High accuracy
- Real-time transcription support
- Free tier available

## Deployment

### Deploy Backend to Render

1. Push code to GitHub
2. Create account on [Render.com](https://render.com)
3. Connect GitHub repository
4. Create new Web Service
5. Set environment variables:
   - `MONGODB_URI`
   - `ASSEMBLYAI_API_KEY`
   - `JWT_SECRET`
6. Deploy

### Deploy Frontend to Netlify

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Deploy to [Netlify](https://netlify.com):
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variable: `VITE_API_URL=https://your-backend-url/api`

### Deploy Frontend to Vercel

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy to [Vercel](https://vercel.com):
   - Connect GitHub repository
   - Vercel auto-detects Vite
   - Add environment variable: `VITE_API_URL`

## Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transcription Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  fileName: String,
  audioPath: String,
  text: String,
  duration: Number,
  status: String (pending, completed, failed),
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The application includes comprehensive error handling:

- **Invalid credentials**: 400 Bad Request
- **Unauthorized access**: 401 Unauthorized
- **File type validation**: Only audio files accepted
- **API failures**: Graceful error messages to users
- **Upload failures**: Automatic cleanup of failed uploads

## Performance Optimization

- **Frontend**:
  - Code splitting with Vite
  - Lazy loading of components
  - Efficient state management with React hooks

- **Backend**:
  - Connection pooling with MongoDB
  - File cleanup on errors
  - Efficient multer configuration

## Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token-based authentication
- ✅ Protected routes with middleware
- ✅ CORS enabled for cross-origin requests
- ✅ File type validation on upload
- ✅ User data isolation (users can only access their transcriptions)

## Troubleshooting

### "MongoDB connection failed"
- Verify MongoDB connection string in `.env`
- Check if IP address is whitelisted in MongoDB Atlas
- Ensure database user has proper permissions

### "AssemblyAI API key is invalid"
- Verify API key in `.env` is correct
- Check if API key has rate limits reached
- Regenerate key from AssemblyAI dashboard if needed

### "CORS error when uploading"
- Backend CORS is enabled by default
- Check if frontend and backend URLs match
- Clear browser cache and try again

### "Files not uploading"
- Check file size (keep under 100MB for free tier)
- Ensure file is a valid audio format
- Check browser console for detailed error message

## Testing

### Manual Testing Checklist

- [ ] Register with new email
- [ ] Login with registered account
- [ ] Upload a test audio file
- [ ] Verify transcription appears
- [ ] Record new audio
- [ ] Check transcription history
- [ ] Download transcription as text
- [ ] Delete a transcription
- [ ] Logout and login again

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for error messages
4. Verify `.env` variables are correct

## Resources

- [AssemblyAI Documentation](https://www.assemblyai.com/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React.js Documentation](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [JWT.io](https://jwt.io/)

## Roadmap

- [ ] Real-time transcription with WebSockets
- [ ] Multiple language support
- [ ] Batch transcription
- [ ] Speaker diarization
- [ ] Transcription editing and correction
- [ ] Export to multiple formats (PDF, DOCX)
- [ ] Dark mode theme
- [ ] Mobile app with React Native

---

**Built with ❤️ using MERN Stack**
