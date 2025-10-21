String Analyzer API
A RESTful API service that analyzes strings and stores their computed properties.

## Features

Analyze strings and compute properties (length, palindrome check, unique characters, word count, SHA-256 hash, character frequency)
Store analyzed strings in MongoDB
Query strings with multiple filters
Natural language query parsing
RESTful API design

## Tech Stack

Runtime: Node.js
Framework: Express.js
Storage: In-memory array with JSON file persistence (no database needed!)
Security: Helmet, CORS
Prerequisites
Node.js (v18 or higher)
npm or yarn
Note: No database installation required! Data is stored in-memory with automatic JSON file backup.

## Local Setup
1. Clone the repository
bash
git clone <your-repo-url>
cd string-analyzer-api

2. Install dependencies
bash
npm install

3. Set up environment variables
Create a .env file in the root directory:

## bash
cp .env.example .env
Edit .env with your configuration:

env
PORT=3000
NODE_ENV=development
Note: No database configuration needed!

4. Run the application
Development mode (with auto-reload):

## bash
npm run dev
Production mode:

## bash
npm start
The API will be available at http://localhost:3000

## API Endpoints
Base URL
http://localhost:3000

Health Check
GET /

## String Endpoints
POST /strings - Create/analyze a string
GET /strings/:string_value - Get specific string
GET /strings - Get all strings with filters
GET /strings/filter-by-natural-language - Natural language filtering
DELETE /strings/:string_value - Delete a string

## Project Structure
string-analyzer-api/
├── src/
│   ├── config/
│   │   └── dataStore.js         # In-memory storage with JSON persistence
│   ├── controllers/              # Request handlers
│   ├── routes/                   # API routes
│   ├── services/                 # Business logic
│   ├── utils/                    # Helper functions
│   ├── app.js                    # Express app setup
│   └── server.js                 # Server entry point
├── data/
│   └── strings.json              # Persisted data (auto-generated)
├── .env                          # Environment variables
├── .gitignore
├── package.json
└── README.md

## Testing
bash
npm test

## Deployment
This API can be deployed to:

Railway
Heroku
AWS (EC2, Elastic Beanstalk, Lambda)
DigitalOcean App Platform
Any Node.js hosting platform
Note: Vercel and Render are not allowed per project requirements.

## Environment Variables
Variable	Description	Required	Default
PORT	Server port	No	3000
NODE_ENV	Environment	No	development
Note: No database configuration needed! Data persists automatically to data/strings.json

## Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
License
MIT



