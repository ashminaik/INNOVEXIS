# DEPLOYMENT GUIDE

## Quick Start - Local Development

### 1. Configure MongoDB Atlas

The IP whitelist error indicates your current IP isn't allowed to connect to MongoDB. Fix this:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Login to your account
3. Go to **Network Access** → **IP Whitelist**
4. Click **Add IP Address**
5. Choose one of these options:
   - **Option A (For Local Testing)**: Click "Add Current IP Address" - adds your current IP
   - **Option B (For Development)**: Click "Add 0.0.0.0/0" to allow all IPs (⚠️ Not for production!)
   - **Option C (Recommended)**: Click "Add 0.0.0.0/0" for now, then restrict later for production

6. Click **Confirm**

### 2. Start Local Development

Terminal 1 - Backend:
```bash
cd server
node index.js
```
Expected output:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

Terminal 2 - Frontend:
```bash
cd client
npm run dev
```
Expected output:
```
VITE v7.3.1 ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 3. Test the Application

1. Open http://localhost:5173
2. Register with a test account
3. Try uploading an audio file
4. Verify transcription appears

---

## Production Deployment

### Option 1: Deploy with Render + Netlify (Recommended)

#### A. Deploy Backend to Render

1. Push your code to GitHub
2. Go to [Render.com](https://render.com) and sign up
3. Click **New +** → **Web Service**
4. Select your GitHub repo
5. Configure:
   - **Name**: `stt-web-app-backend`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
6. Click **Advanced**
7. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   ASSEMBLYAI_API_KEY=<your-api-key>
   JWT_SECRET=<generate-a-strong-secret>
   ```
8. Click **Deploy**

Your backend will be live at: `https://stt-web-app-backend.onrender.com`

#### B. Deploy Frontend to Netlify

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```

2. Go to [Netlify.com](https://netlify.com) and sign up
3. Click **New site from Git**
4. Select your GitHub repo
5. Configure:
   - **Build Command**: `cd client && npm run build`
   - **Publish Directory**: `client/dist`
6. Click **Advanced** → **Add environment variables**:
   ```
   VITE_API_URL=https://stt-web-app-backend.onrender.com/api
   ```
7. Click **Deploy site**

---

### Option 2: Deploy with Vercel (Full-stack)

#### A. Deploy Frontend + Backend to Vercel

1. Push code to GitHub (both client and server in same repo)
2. Go to [Vercel.com](https://vercel.com) and sign up
3. Click **Add New** → **Project**
4. Select your GitHub repo
5. Framework: Select **Other**
6. Set **Root Directory**: Leave empty (or `client` if you want only frontend)
7. Add environment variables:
   ```
   MONGODB_URI=<your-mongodb-uri>
   ASSEMBLYAI_API_KEY=<your-api-key>
   JWT_SECRET=<generate-secret>
   ```
8. Click **Deploy**

For the backend API, create a `/api` folder with serverless functions (optional - use Render instead for Node.js backend).

---

### Option 3: Deploy with Railway.app

#### A. Deploy Backend

1. Go to [Railway.app](https://railway.app) and sign up
2. Click **New Project** → **Deploy from GitHub**
3. Select your repo
4. Go to **Variables**
5. Add:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   ASSEMBLYAI_API_KEY=<your-api-key>
   JWT_SECRET=<secret>
   ```
6. Railway auto-detects Node.js and starts deployment

#### B. Deploy Frontend

```bash
cd client
npm run build
# Deploy the 'dist' folder to Netlify or Vercel
```

---

### Option 4: Docker Deployment

#### Create Docker Configuration

**server/Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

**docker-compose.yml** (root):
```yaml
version: '3.8'

services:
  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - ASSEMBLYAI_API_KEY=${ASSEMBLYAI_API_KEY}
      - JWT_SECRET=${JWT_SECRET}
      - PORT=5000
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./client
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:5000/api
    depends_on:
      - backend
```

**Run with Docker**:
```bash
docker-compose up --build
```

---

## Environment Variables Reference

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
ASSEMBLYAI_API_KEY=your-api-key-here
JWT_SECRET=your-super-secret-key-min-32-chars-for-production
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
# For production:
# VITE_API_URL=https://your-backend-domain.com/api
```

---

## Pre-Deployment Checklist

### Backend
- [ ] MongoDB Atlas cluster created
- [ ] IP whitelist configured
- [ ] AssemblyAI API key obtained
- [ ] JWT_SECRET generated (use `openssl rand -base64 32`)
- [ ] `npm start` runs without errors locally
- [ ] All environment variables set
- [ ] Database connection test passes
- [ ] Upload directory writable

### Frontend
- [ ] `npm run build` completes successfully
- [ ] VITE_API_URL points to correct backend
- [ ] All components render without errors
- [ ] API calls use correct endpoints
- [ ] Authentication flow works

### Production Security
- [ ] MongoDB IP whitelist restricted to known IPs
- [ ] JWT_SECRET is strong and unique
- [ ] CORS properly configured for production domain
- [ ] HTTPS enabled on frontend
- [ ] Environment variables not committed to Git
- [ ] File uploads validated on backend
- [ ] Rate limiting implemented
- [ ] Error messages don't expose sensitive info

---

## Troubleshooting Deployment

### MongoDB Connection Failed
```
MongooseServerSelectionError: Could not connect...
```
**Solution:**
1. Check IP whitelist in MongoDB Atlas
2. Verify connection string includes correct credentials
3. Ensure username/password don't have special characters
4. Add `?retryWrites=true&w=majority` to connection string

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
1. Verify frontend URL in backend CORS config
2. Update CORS in `server/index.js`:
   ```javascript
   app.use(cors({
     origin: process.env.FRONTEND_URL || '*',
     credentials: true
   }));
   ```

### File Upload Fails
```
Error: ENOENT: no such file or directory
```
**Solution:**
1. Ensure `uploads/` directory exists
2. Check file permissions
3. Verify multer configuration in `routes/transcribe.js`

### AssemblyAI API Key Invalid
```
401 Unauthorized
```
**Solution:**
1. Regenerate API key from AssemblyAI dashboard
2. Verify key is copied completely
3. Check if API rate limit exceeded

---

## Monitoring & Logging

### Backend Health Check
```bash
curl https://your-backend-domain.com/api/health
```

Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-30T16:00:00.000Z"
}
```

### View Logs (Render)
1. Go to Render dashboard
2. Click your service
3. Go to **Logs** tab

### View Logs (Railway)
1. Go to Railway dashboard
2. Click your project
3. Logs appear in the right panel

### View Logs (Netlify)
1. Go to Netlify dashboard
2. Click your site
3. Go to **Deploys** → Recent deployment → **View deploy log**

---

## Cost Estimates

| Service | Free Tier | Cost |
|---------|-----------|------|
| MongoDB Atlas | 512MB storage | $0 - Pay-as-you-go |
| Render | 750 hours/month | $7+/month for always-on |
| Netlify | 300 build minutes/month | $0 - Free tier good for personal projects |
| Railway | $5/month credit | $0.10/hour for compute |
| AssemblyAI | 100 min/month free | $0.10/min after free tier |

---

## Performance Optimization

### Frontend
```bash
# Build with optimization
npm run build

# Check bundle size
npm run build -- --analyze
```

### Backend
```javascript
// Add caching
const redis = require('redis');
const client = redis.createClient();

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## Rollback Procedure

### Render
1. Go to Render dashboard
2. Click your service
3. Click **Previous Deploys**
4. Select earlier version
5. Click **Redeploy**

### Netlify
1. Go to **Deploys** tab
2. Click earlier deployment
3. Click **Publish** or use **Rollback**

### Railway
1. View deploy history
2. Click earlier deployment
3. Click **Rollback to this deployment**

---

## Support & Resources

- [MongoDB Atlas Documentation](https://docs.mongodb.com/manual/)
- [Render Deployment Guide](https://render.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [AssemblyAI API Docs](https://www.assemblyai.com/docs)
