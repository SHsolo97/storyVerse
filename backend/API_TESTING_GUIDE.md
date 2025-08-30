# 📋 StoryVerse API Testing Guide

## Quick Access URLs

### 🏠 Core Endpoints
- **API Root**: http://localhost:3000/api/v1
- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/api/v1/health

### 📊 Health Monitoring
- **Complete Health**: http://localhost:3000/api/v1/health
- **Readiness Probe**: http://localhost:3000/api/v1/health/ready  
- **Liveness Probe**: http://localhost:3000/api/v1/health/live

## 🔐 Authentication Testing

### 1. Register a New User
```bash
curl -X POST "http://localhost:3000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Response includes:**
- `accessToken`: Use for authenticated requests
- `refreshToken`: Use to refresh expired tokens
- `user`: User profile information

### 3. Access Protected Endpoint
```bash
curl -X GET "http://localhost:3000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 📚 Story API Testing

### 1. Get All Published Stories
```bash
curl -X GET "http://localhost:3000/api/v1/stories"
```

### 2. Get Stories by Genre
```bash
curl -X GET "http://localhost:3000/api/v1/stories?genre=Romance"
```

### 3. Get Available Genres
```bash
curl -X GET "http://localhost:3000/api/v1/stories/genres"
```

### 4. Get Specific Story
```bash
curl -X GET "http://localhost:3000/api/v1/stories/STORY_ID"
```

## 🎮 Gameplay Testing

### 1. Get Story Chapters (to find chapter IDs)
```bash
curl -X GET "http://localhost:3000/api/v1/stories/STORY_ID/chapters"
```

### 2. Start a Chapter
```bash
curl -X POST "http://localhost:3000/api/v1/gameplay/start-chapter" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "CHAPTER_ID"
  }'
```

**Note**: Use the `chapterId` from the chapters endpoint, not `storyId` + `chapterNumber`.

### 3. Make a Choice
```bash
curl -X POST "http://localhost:3000/api/v1/gameplay/make-choice" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "storyId": "STORY_ID",
    "sceneId": "scene_1",
    "choiceId": "accept_quest"
  }'
```

### 4. Get User Progress
```bash
curl -X GET "http://localhost:3000/api/v1/gameplay/progress/STORY_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. Get Current Scene
```bash
curl -X GET "http://localhost:3000/api/v1/gameplay/current-scene/STORY_ID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 💎 Inventory Testing

### 1. Check User Inventory
```bash
curl -X GET "http://localhost:3000/api/v1/inventory" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 💳 Payment Testing

### 1. Get Available Products
```bash
curl -X GET "http://localhost:3000/api/v1/payment/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🔄 Testing with Swagger UI

1. **Open Swagger**: http://localhost:3000/api
2. **Try endpoints interactively**: Click "Try it out" on any endpoint
3. **Authenticate**: Click "Authorize" and enter JWT token
4. **Test with sample data**: Swagger provides example requests

### Authentication in Swagger:
1. First register/login via API or Swagger
2. Copy the `accessToken` from the response
3. Click "Authorize" in Swagger UI
4. Enter: `Bearer YOUR_ACCESS_TOKEN`
5. Now all protected endpoints will work

## 🏥 Health Check Responses

### Comprehensive Health Check
**GET** `/api/v1/health`
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "mongodb": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" },
    "storage": { "status": "up" }
  },
  "error": {},
  "details": { /* detailed info */ }
}
```

### Liveness Probe
**GET** `/api/v1/health/live`
```json
{
  "status": "ok",
  "timestamp": "2025-08-31T00:11:04.000Z",
  "uptime": 1205.234,
  "environment": "development",
  "version": "1.0.0"
}
```

## 🚨 Error Testing

### 1. Invalid Authentication
```bash
curl -X GET "http://localhost:3000/api/v1/users/me"
# Expected: 401 Unauthorized
```

### 2. Invalid Data
```bash
curl -X POST "http://localhost:3000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "invalid-email", "password": "123"}'
# Expected: 400 Bad Request with validation errors
```

## 🔧 Environment Testing

### Development Mode
- **Hot Reload**: File changes automatically restart server
- **Detailed Logs**: Full error stacktraces
- **Debug Mode**: Additional debugging information

### Database Connectivity
- **PostgreSQL**: User accounts, inventory, stories
- **MongoDB**: Gameplay progress, story content
- **Redis**: Session caching, rate limiting

## 📈 Performance Testing

### Rate Limiting Test
Make multiple rapid requests to see throttling:
```bash
for i in {1..10}; do
  curl -X GET "http://localhost:3000/api/v1/stories"
done
```

### Load Testing with Health Check
```bash
for i in {1..50}; do
  curl -X GET "http://localhost:3000/api/v1/health/live" &
done
```

## 🐛 Debugging Tips

1. **Check Logs**: Watch the terminal running the server
2. **Verify Database**: Ensure Docker containers are running
3. **Test Health**: Always start with `/health` endpoint
4. **Use Swagger**: Interactive testing is easier in the UI
5. **Check Authentication**: Ensure JWT tokens are valid and not expired

## 📝 Sample Data Available

The application comes with pre-seeded data:

### Stories:
1. **"The Royal Academy"** (Romance)
2. **"Mystery of the Lost City"** (Adventure)

Each story includes:
- Complete metadata
- Sample chapters
- Ready for gameplay testing

### Getting Required IDs:

#### 1. Get Story IDs:
```bash
curl -X GET "http://localhost:3000/api/v1/stories"
```
Copy the `id` field from the response.

#### 2. Get Chapter IDs:
```bash
curl -X GET "http://localhost:3000/api/v1/stories/YOUR_STORY_ID/chapters"
```
Copy the `id` field from the chapters array.

#### 3. Start Gameplay:
```bash
curl -X POST "http://localhost:3000/api/v1/gameplay/start-chapter" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "YOUR_CHAPTER_ID"
  }'
```

Use these IDs in your API tests to have immediate data to work with!
