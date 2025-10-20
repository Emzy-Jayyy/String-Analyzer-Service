# String Analyzer API

A RESTful API service that analyzes strings and stores their computed properties.

## Features

- Analyze strings and compute properties (length, palindrome check, unique characters, word count, SHA-256 hash, character frequency)
- Store analyzed strings in MongoDB
- Query strings with multiple filters
- Natural language query parsing
- RESTful API design

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Storage:** In-memory array with JSON file persistence (no database needed!)
- **Security:** Helmet, CORS

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd string-analyzer-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/string-analyzer
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/string-analyzer
```

### 4. Start MongoDB (if using local MongoDB)

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 5. Run the application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Health Check
```
GET /
```

### String Endpoints (Coming in next steps)
- `POST /strings` - Create/analyze a string
- `GET /strings/:string_value` - Get specific string
- `GET /strings` - Get all strings with filters
- `GET /strings/filter-by-natural-language` - Natural language filtering
- `DELETE /strings/:string_value` - Delete a string

## Project Structure

```
string-analyzer-api/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/              # Request handlers
│   ├── models/                   # Database schemas
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── middleware/               # Custom middleware
│   ├── utils/                    # Helper functions
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## Testing

```bash
npm test
```

## Deployment

This API can be deployed to:
- Railway
- Heroku  
- AWS (EC2, Elastic Beanstalk, Lambda)
- DigitalOcean App Platform
- Any Node.js hosting platform

**Note:** Vercel and Render are not allowed per project requirements.

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| PORT | Server port | No | 3000 |
| NODE_ENV | Environment | No | development |
| MONGODB_URI | MongoDB connection string | Yes | - |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Author

Your Name - your.email@example.com