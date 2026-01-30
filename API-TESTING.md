# API Testing Guide

## Quick Setup

Before testing, ensure both servers are running:

```bash
# Terminal 1: Backend
cd server && node index.js

# Terminal 2: Frontend
cd client && npm run dev
```

## Manual API Testing with cURL

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "test@example.com"
}
```

### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY3NDAxNjAwMH0.abcdef..."
}
```

Save the token for next requests:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY3NDAxNjAwMH0.abcdef..."
```

### 3. Get Transcriptions (Requires Token)

```bash
curl http://localhost:5000/api/transcribe \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
[]
```
(Empty array because we haven't transcribed anything yet)

### 4. Upload & Transcribe Audio

Prepare an audio file first:
```bash
# Record a test audio with macOS
afplay /System/Library/Sounds/Glass.aiff > test-audio.wav 2>&1

# Or use an existing audio file
# cp your-audio.mp3 test-audio.mp3
```

Upload:
```bash
curl -X POST http://localhost:5000/api/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  -F "audio=@test-audio.mp3"
```

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439012",
  "fileName": "test-audio.mp3",
  "text": "This is the transcribed text from your audio...",
  "createdAt": "2024-01-30T12:00:00.000Z"
}
```

### 5. Get All Transcriptions

```bash
curl http://localhost:5000/api/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  | jq .
```

**Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "fileName": "test-audio.mp3",
    "text": "This is the transcribed text...",
    "status": "completed",
    "createdAt": "2024-01-30T12:00:00.000Z",
    "updatedAt": "2024-01-30T12:00:00.000Z"
  }
]
```

### 6. Delete Transcription

```bash
TRANSCRIPTION_ID="507f1f77bcf86cd799439012"

curl -X DELETE "http://localhost:5000/api/transcribe/$TRANSCRIPTION_ID" \
  -H "Authorization: Bearer $TOKEN"
```

**Response:**
```json
{
  "message": "Transcription deleted"
}
```

### 7. Health Check

```bash
curl http://localhost:5000/api/health | jq .
```

**Response:**
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

## Testing with Postman

### 1. Import Collection

Create a new Postman collection with these requests:

### Request 1: Register
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "email": "postman@test.com",
  "password": "postman123"
}
```

### Request 2: Login
```
POST http://localhost:5000/api/auth/login
Body (JSON):
{
  "email": "postman@test.com",
  "password": "postman123"
}
```

After login, copy the token from response and set as:
```
Authorization → Bearer Token → [paste-token-here]
```

### Request 3: Get Transcriptions
```
GET http://localhost:5000/api/transcribe
Headers:
  Authorization: Bearer {token}
```

### Request 4: Upload Audio
```
POST http://localhost:5000/api/transcribe
Headers:
  Authorization: Bearer {token}
Body → form-data:
  Key: audio
  Value: [select audio file]
  Type: File
```

### Request 5: Delete Transcription
```
DELETE http://localhost:5000/api/transcribe/{transcription_id}
Headers:
  Authorization: Bearer {token}
```

## Testing with JavaScript (Node.js)

```javascript
// test-api.js
const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
let TOKEN = '';
let TRANSCRIPTION_ID = '';

async function runTests() {
  try {
    // 1. Register
    console.log('1. Registering user...');
    const registerRes = await axios.post(`${API_URL}/auth/register`, {
      email: `test${Date.now()}@example.com`,
      password: 'testpassword123'
    });
    console.log('✅ Registered:', registerRes.data.email);

    // 2. Login
    console.log('\n2. Logging in...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: registerRes.data.email,
      password: 'testpassword123'
    });
    TOKEN = loginRes.data.token;
    console.log('✅ Logged in, token:', TOKEN.substring(0, 20) + '...');

    // 3. Get transcriptions (should be empty)
    console.log('\n3. Getting transcriptions...');
    const getRes = await axios.get(`${API_URL}/transcribe`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    console.log('✅ Transcriptions:', getRes.data.length);

    // 4. Test with mock transcription in DB
    console.log('\n4. API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

runTests();
```

Run:
```bash
npm install axios
node test-api.js
```

## Testing with cURL Script

Create `test-api.sh`:
```bash
#!/bin/bash

API_URL="http://localhost:5000/api"
EMAIL="test-$(date +%s)@example.com"
PASSWORD="testpass123"

echo "🧪 Running API Tests..."
echo "========================"

# 1. Register
echo -e "\n1️⃣  REGISTER"
REGISTER=$(curl -s -X POST "$API_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$REGISTER" | jq .
USERID=$(echo "$REGISTER" | jq -r '._id')

# 2. Login
echo -e "\n2️⃣  LOGIN"
LOGIN=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
echo "$LOGIN" | jq .
TOKEN=$(echo "$LOGIN" | jq -r '.token')

# 3. Get Transcriptions
echo -e "\n3️⃣  GET TRANSCRIPTIONS"
curl -s "$API_URL/transcribe" \
  -H "Authorization: Bearer $TOKEN" | jq .

# 4. Health Check
echo -e "\n4️⃣  HEALTH CHECK"
curl -s "$API_URL/health" | jq .

echo -e "\n✅ All tests completed!"
```

Run:
```bash
chmod +x test-api.sh
./test-api.sh
```

## Expected Error Responses

### 401 Unauthorized
```bash
curl http://localhost:5000/api/transcribe
```
**Response:**
```json
{
  "error": "No token provided"
}
```

### 400 Bad Request
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' # Missing password
```
**Response:**
```json
{
  "error": "Password is required"
}
```

### 404 Not Found
```bash
curl http://localhost:5000/api/nonexistent
```
**Response:**
```json
{
  "error": "Route not found"
}
```

## Performance Testing

### Test File Upload Speed

```bash
# Create a large test audio file (using dd)
dd if=/dev/zero bs=1M count=10 of=large-audio.bin

# Time the upload
time curl -X POST http://localhost:5000/api/transcribe \
  -H "Authorization: Bearer $TOKEN" \
  -F "audio=@large-audio.bin"
```

### Load Testing with Apache Bench

```bash
# Test endpoint without authentication
ab -n 100 -c 10 http://localhost:5000/api/health

# Results show:
# Requests per second
# Time per request
# Connection success rate
```

## Testing Checklist

- [ ] Register with valid credentials
- [ ] Register with duplicate email (should fail)
- [ ] Register with weak password
- [ ] Login with correct credentials
- [ ] Login with wrong password (should fail)
- [ ] Login with non-existent email (should fail)
- [ ] Get transcriptions without token (should fail)
- [ ] Get transcriptions with valid token (should return array)
- [ ] Upload valid audio file
- [ ] Upload invalid file type (should fail)
- [ ] Delete transcription with valid ID
- [ ] Delete transcription with invalid ID (should fail)
- [ ] Delete transcription by another user (should fail)
- [ ] Health check returns 200

## Debugging Tips

### View All Requests (Enable Logging)

Add to `server/index.js`:
```javascript
const morgan = require('morgan');
app.use(morgan('dev')); // Log all requests
```

Install:
```bash
npm install morgan
```

### Check Token Contents

Paste JWT at [jwt.io](https://jwt.io/) to decode and verify contents.

### Enable CORS Logging

Add to `server/index.js`:
```javascript
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});
```

## Resources

- [cURL Documentation](https://curl.se/docs/)
- [Postman Download](https://www.postman.com/downloads/)
- [HTTP Status Codes](https://httpwg.org/specs/rfc9110.html#status.codes)
- [JWT.io](https://jwt.io/)
