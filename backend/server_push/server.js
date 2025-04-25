import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import http from 'http';
import cors from 'cors';
import serverPushRouter from './routes/server_push.js';

dotenv.config();

const app = express();

// Increase the size limit for JSON
app.use(bodyParser.json({ limit: '1mb' }));

// Middleware for handling JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

// Main route
app.get('/', (req, res) => {
  res.send('Push notification server is running!');
});

// Register routes from server_push.js
app.use('/push', serverPushRouter);

// Configure CORS for the entire application
app.use(
  cors({
    origin: 'http://localhost:5173', // Change this to the frontend origin
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

// Add specific CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

const port = process.env.PORT || 4000; // Use PORT from environment variables or default to 4000

try {
  const server = http.createServer(app);

  server.listen(port, () => {
    console.log(
      `Push notification server started and listening on http://localhost:${port}`,
    );
    console.log(`Test the server at: http://localhost:${port}/push`);
  });
} catch (error) {
  console.error('Error starting the server:', error);

  // Fallback to HTTP server if there is an issue with certificates
  console.log('Attempting to start HTTP server in fallback mode...');
  app.listen(port, () => {
    console.log(
      `Push notification server started in HTTP mode on port ${port}`,
    );
    console.log(`WARNING: Push notifications require HTTPS in production`);
  });
}
