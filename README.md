# WhatsApp-Style Status System

This project implements a simplified version of WhatsApp's status feature, demonstrating core concepts of ephemeral content sharing in social media applications.

## System Design

### Architecture Overview

```
├── src/
│   ├── config/
│   │   └── constants.js     # Application configuration
│   ├── controllers/
│   │   └── statusController.js  # Request handlers
│   ├── models/
│   │   └── status.js       # Data model and business logic
│   └── routes/
│       └── statusRoutes.js  # API route definitions
└── server.js               # Application entry point
```

### Key Features

1. **Status Posting**
   - Users can post temporary status updates
   - Each status is associated with a unique user ID
   - Timestamps are automatically recorded for expiration tracking

2. **Status Expiration**
   - Statuses automatically expire after 5 minutes
   - Similar to WhatsApp's 24-hour expiration, but shortened for demonstration
   - Time-based validation ensures content freshness

3. **Status Resharing**
   - Users can reshare others' active statuses
   - Reshared content creates a new timestamp
   - Original content must be valid (not expired) to be reshared

### Technical Implementation

#### Data Model
- In-memory storage (for demonstration purposes)
- Status object structure:
  ```javascript
  {
    userId: {
      content: String,
      timestamp: Number
    }
  }
  ```

#### API Endpoints

1. **Post Status**
   - Endpoint: `POST /postStatus`
   - Purpose: Create new status
   - Payload:
     ```json
     {
       "userId": "string",
       "content": "string"
     }
     ```

2. **Check Status**
   - Endpoint: `GET /checkStatus/:userId`
   - Purpose: Verify status validity and content
   - Response:
     ```json
     {
       "valid": boolean,
       "content": "string" // if valid
     }
     ```

3. **Reshare Status**
   - Endpoint: `POST /reshareStatus`
   - Purpose: Repost another user's status
   - Payload:
     ```json
     {
       "originalUserId": "string",
       "resharingUserId": "string"
     }
     ```

### Design Patterns

1. **MVC Architecture**
   - **Models**: Handle data structure and business logic
   - **Views**: (Not implemented in this API-only version)
   - **Controllers**: Manage request/response flow

2. **Separation of Concerns**
   - Configuration isolated in constants
   - Routing logic separated from controllers
   - Business logic encapsulated in models

### Real-World Considerations

For production implementation, consider:

1. **Persistence**
   - Replace in-memory storage with a database
   - Recommended: Redis for fast expiring content

2. **Scalability**
   - Implement caching layer
   - Add load balancing
   - Use message queues for async operations

3. **Security**
   - Add authentication
   - Implement rate limiting
   - Add input validation

4. **Additional Features**
   - Media support (images/videos)
   - Status privacy settings
   - View counts and viewer lists
   - Status reactions

## Learning Concepts

This implementation demonstrates several key concepts:

1. **Ephemeral Content**
   - Time-based content validity
   - Automatic expiration
   - Content lifecycle management

2. **API Design**
   - RESTful endpoints
   - Stateless operations
   - Clear request/response contracts

3. **Code Organization**
   - MVC pattern
   - Modular architecture
   - Configuration management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   node server.js
   ```

3. The server will run on http://localhost:3000

## Testing Examples

### Post a Status
```bash
curl -X POST http://localhost:3000/postStatus \
  -H "Content-Type: application/json" \
  -d '{"userId": "user1", "content": "Hello, World!"}'
```

### Check a Status
```bash
curl http://localhost:3000/checkStatus/user1
```

### Reshare a Status
```bash
curl -X POST http://localhost:3000/reshareStatus \
  -H "Content-Type: application/json" \
  -d '{"originalUserId": "user1", "resharingUserId": "user2"}'
```

## Future Enhancements

1. User authentication and authorization
2. Media file support
3. Status privacy controls
4. Persistent storage
5. View tracking
6. Push notifications
7. Status replies and reactions

---

This project serves as a learning tool to understand the concepts behind ephemeral content sharing systems like WhatsApp Status, Instagram Stories, and Snapchat Stories.