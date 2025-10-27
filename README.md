# Daily Update Backend - Sync API

A minimal backend sync system for learning synchronization between Realm (mobile) and MongoDB.

## Features

✅ Timestamp-based sync  
✅ CRUD operations for notes  
✅ Conflict detection and resolution  
✅ Soft deletes  
✅ RESTful API  
✅ CORS enabled  

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start MongoDB
Make sure MongoDB is running on `localhost:27017`

```bash
# Ubuntu/Linux
sudo systemctl start mongod

# macOS (Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 mongo
```

### 3. Start the Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on `http://localhost:3000`

## API Endpoints

### Notes Sync API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/notes/sync` | Main sync endpoint (push & pull) |
| GET | `/api/notes/:userEmail` | Get all notes for a user |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:noteId` | Update a note |
| DELETE | `/api/notes/:noteId` | Delete a note (soft delete) |

## Testing

### Test Sync Endpoint
```bash
curl -X POST http://localhost:3000/api/notes/sync \
  -H "Content-Type: application/json" \
  -d '{
    "userEmail": "test@example.com",
    "lastSync": "2025-01-01T00:00:00.000Z",
    "changes": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "My First Note",
        "note": "This is a test note",
        "createdAt": "2025-10-27T10:00:00.000Z",
        "updatedAt": "2025-10-27T10:00:00.000Z"
      }
    ]
  }'
```

### Get All Notes
```bash
curl http://localhost:3000/api/notes/test@example.com
```

### Create Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "507f1f77bcf86cd799439012",
    "title": "New Note",
    "note": "Note content",
    "userEmail": "test@example.com",
    "createdAt": "2025-10-27T10:00:00.000Z",
    "updatedAt": "2025-10-27T10:00:00.000Z"
  }'
```

## Project Structure

```
├── app.js                  # Express app setup (CORS enabled)
├── bin/
│   └── www                 # Server entry point
├── configs/
│   └── database.js         # MongoDB connection
├── models/
│   ├── User.js             # User model
│   └── Note.js             # Note model with sync fields (ObjectId)
├── routes/
│   ├── index.js            # Home route
│   └── notes.js            # Notes API routes (sync + CRUD)
├── services/
│   ├── SyncService.js      # Sync logic
│   ├── OperationApplier.js
│   └── WebSocketService.js
├── frontend-integration/   # Frontend files
│   ├── README.md          # Frontend setup guide
│   ├── useSync.ts         # React sync hook (copy to your app)
│   ├── usage-example.tsx  # Complete usage examples
│   └── objectid-conversion.md # ObjectId quick reference
├── package.json
├── README.md              # This file
├── QUICKSTART.md          # 5-minute setup guide
├── SYNC_GUIDE.md          # Detailed sync implementation
├── OBJECTID_GUIDE.md      # ObjectId compatibility guide
└── test-api.js            # API testing script
```

## How Sync Works

1. **Client tracks `lastSync` timestamp**
2. **Client collects local changes** since lastSync
3. **Client sends changes to server** (PUSH)
4. **Server checks for conflicts** and applies changes
5. **Server returns changes** since client's lastSync (PULL)
6. **Client applies server changes** to local database
7. **Client updates `lastSync`** timestamp

### Conflict Resolution
- **Strategy**: Server-Wins (default)
- Server version is kept when both client and server have changes
- Client receives updated version in sync response

## Frontend Integration

See **[SYNC_GUIDE.md](./SYNC_GUIDE.md)** for detailed frontend integration with:
- React Native + Realm
- TypeScript hooks
- Auto-sync implementation
- Conflict handling
- Complete examples

## Database Schema

### Note
```javascript
{
  _id: ObjectId,            // MongoDB ObjectId (compatible with Realm.BSON.ObjectId)
  title: String,
  note: String,
  userEmail: String,        // User identifier
  createdAt: Date,
  updatedAt: Date,          // Used for sync
  isDeleted: Boolean,       // Soft delete flag
  deletedAt: Date
}
```

> **Note**: The `_id` field uses MongoDB's native ObjectId type, which is fully compatible with Realm's `Realm.BSON.ObjectId`. See [OBJECTID_GUIDE.md](./OBJECTID_GUIDE.md) for details on how they work together.

### User
```javascript
{
  name: String,
  email: String,            // Unique identifier
  createdAt: Date,
  lastSync: Date           // Server's last sync time
}
```

## Configuration

### Change MongoDB Connection
Edit `configs/database.js`:
```javascript
const mongoURI = "mongodb://127.0.0.1:27017/daily_update_db";
```

### Change Server Port
Edit `bin/www`:
```javascript
var port = normalizePort(process.env.PORT || '3000');
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **cors**: Enable CORS
- **morgan**: HTTP request logger
- **cookie-parser**: Parse cookies

## Environment

- Node.js 14+
- MongoDB 4+
- npm/yarn

## Development

```bash
# Install dependencies
npm install

# Run in development mode (auto-reload)
npm run dev

# Run in production mode
npm start
```

## Learning Resources

This is a **minimal implementation for learning purposes**. It demonstrates:
- Basic sync concepts
- Conflict detection
- Timestamp-based synchronization
- RESTful API design
- MongoDB integration

### Not Included (Production Features)
- Authentication/Authorization (JWT)
- Encryption
- Rate limiting
- Data validation
- Delta sync (only changed fields)
- Offline queue
- WebSocket real-time sync
- Comprehensive error handling

## Next Steps

1. ✅ Basic sync working
2. 🔲 Add JWT authentication
3. 🔲 Implement WebSocket for real-time updates
4. 🔲 Add offline queue support
5. 🔲 Implement delta sync
6. 🔲 Add data validation
7. 🔲 Improve conflict resolution UI

## Troubleshooting

### MongoDB Connection Error
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in `configs/database.js`
- Try `127.0.0.1` instead of `localhost`

### CORS Error
- CORS is enabled globally in `app.js`
- Check frontend is making requests to correct URL
- Verify `Access-Control-Allow-Origin` header

### Sync Not Working
- Check server logs for errors
- Verify `userEmail` is consistent
- Check `lastSync` timestamp format
- Look at MongoDB data directly

## License

MIT

## Contributing

This is a learning project. Feel free to fork and experiment!

---

### Additional Guides

- **[QUICKSTART.md](./QUICKSTART.md)** - Get started in 5 minutes
- **[SYNC_GUIDE.md](./SYNC_GUIDE.md)** - Detailed sync implementation  
- **[OBJECTID_GUIDE.md](./OBJECTID_GUIDE.md)** - Realm ↔ MongoDB ObjectId compatibility
- **[frontend-integration/](./frontend-integration/)** - Frontend integration files

