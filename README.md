# Speech-to-Text Web App

A full-stack Speech-to-Text application built with the MERN stack (MongoDB, Express, React, Node.js) that allows users to record or upload audio files and convert them into text using AssemblyAI's powerful speech recognition API.

## Features

- 🎤 **Audio Recording**: Record audio directly from your browser
- 📁 **Audio Upload**: Upload audio files in multiple formats
- 🔐 **User Authentication**: Secure user registration and login with JWT
- 📜 **Transcription History**: View, manage, and copy all transcriptions
- ✨ **Real-time Status Updates**: Track transcription progress
- 🎨 **Modern UI**: Beautiful, responsive design with gradient styling
- 📱 **Mobile Friendly**: Fully responsive on all devices

## Tech Stack

### Frontend
- React 18.2
- Vite (Fast build tool)
- Axios (HTTP client)
- CSS3 with modern styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- AssemblyAI API for speech-to-text

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB connection string
- AssemblyAI API key

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create or update the `.env` file with your credentials:
```env
PORT=5001
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The server will run on `http://localhost:5001`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Verify the `.env` file has the correct API URL:
```env
VITE_API_URL=http://localhost:5001/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## Project Structure

```
stt-web-app/
├── server/
│   ├── models/
│   │   ├── User.js          # User schema with password hashing
│   │   └── Transcript.js    # Transcript schema
│   ├── routes/
│   │   ├── auth.js          # Authentication endpoints
│   │   └── transcribe.js    # Transcription endpoints
│   ├── index.js             # Main server file
│   ├── package.json         # Server dependencies
│   └── .env                 # Environment variables
├── client/
│   ├── components/
│   │   ├── Auth.jsx         # Login/Register component
│   │   ├── Auth.css
│   │   ├── Transcriber.jsx  # Recording/Upload component
│   │   ├── Transcriber.css
│   │   ├── TranscriptList.jsx # History display component
│   │   └── TranscriptList.css
│   ├── App.jsx              # Main app component
│   ├── App.css
│   ├── main.jsx             # Entry point
│   ├── index.html           # HTML template
│   ├── index.css            # Global styles
│   ├── vite.config.js       # Vite configuration
│   ├── package.json         # Client dependencies
│   └── .env                 # Environment variables
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Transcriptions
- `POST /api/transcribe/upload` - Upload audio and start transcription
- `GET /api/transcribe/list` - Get user's transcriptions (requires auth)
- `GET /api/transcribe/:id` - Get specific transcript (requires auth)
- `DELETE /api/transcribe/:id` - Delete transcript (requires auth)

## Usage

1. **Register/Login**: Create an account or login to your existing account
2. **Record Audio**: Click "Start Recording" to record audio from your microphone
3. **Or Upload**: Click "Choose Audio File" to upload an audio file
4. **Transcribe**: Click "Transcribe" to send the audio for processing
5. **View History**: See all your transcriptions in the history section
6. **Copy & Delete**: Copy transcription text or delete transcriptions as needed

## Authentication Flow

1. User registers with username, email, and password
2. Password is hashed using bcryptjs before storage
3. On login, password is verified and JWT token is generated
4. Token is stored in localStorage on the client
5. All API requests include the token in the Authorization header
6. Server validates token before processing requests

## How Speech-to-Text Works

1. User records or uploads audio file
2. Audio is converted to base64 and sent to backend
3. Backend saves audio file and creates transcript record in database
4. Backend sends audio to AssemblyAI API for processing
5. AssemblyAI processes the audio asynchronously
6. Results are updated in the database
7. Frontend polls the API every 3 seconds to check for updates
8. When complete, transcription text is displayed to user

## Database Schema

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Transcript
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  audioUrl: String,
  text: String,
  duration: Number,
  language: String,
  status: String (pending|processing|completed|failed),
  confidence: Number (0-1),
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Server (.env)
```
PORT=5001
MONGODB_URI=your_mongodb_connection_string
ASSEMBLYAI_API_KEY=your_api_key
JWT_SECRET=your_secret_key
```

### Client (.env)
```
VITE_API_URL=http://localhost:5001/api
```

## Error Handling

The application includes comprehensive error handling:
- Network errors are caught and displayed to users
- Invalid file formats are rejected
- Authentication errors trigger re-login
- Database errors are logged and reported
- API failures show user-friendly error messages

## Security Features

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens are used for stateless authentication
- Tokens expire in 7 days
- User can only access their own transcriptions
- File uploads are validated and stored securely
- CORS is enabled for frontend-backend communication

## Deployment

### Backend Deployment (Render, Heroku, etc.)
1. Push code to Git repository
2. Connect repository to hosting platform
3. Set environment variables on platform
4. Platform automatically builds and deploys

### Frontend Deployment (Netlify, Vercel, etc.)
1. Build the frontend: `npm run build`
2. Connect repository to hosting platform
3. Platform automatically builds and deploys
4. Update `VITE_API_URL` to point to deployed backend

## Troubleshooting

### Microphone access denied
- Check browser permissions for microphone access
- Try a different browser
- Ensure HTTPS is used in production

### Audio not transcribing
- Verify AssemblyAI API key is valid
- Check that audio file is not corrupted
- Check server logs for API errors
- Ensure MongoDB connection is active

### Login not working
- Clear browser cache and cookies
- Check JWT_SECRET is consistent
- Verify MongoDB is running and accessible
- Check network connection to backend

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Resources

- [AssemblyAI Documentation](https://www.assemblyai.com/docs)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Mongoose](https://mongoosejs.com)
- [Vite Documentation](https://vitejs.dev)

---

Made with ❤️ for learning full-stack development
