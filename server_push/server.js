import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import http from "http";
import cors from "cors";
import serverPushRouter from "./routes/server_push.js";

// Load env variables
dotenv.config();

// Setup Express app
const app = express();

// Configure CORS for the entire app
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware to allow CORS headers manually (optional if already covered above)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

// Body parser (after CORS)
app.use(bodyParser.json({ limit: "1mb" }));

// Middleware for JSON errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

// Routes
app.get("/", (req, res) => {
  res.send("Push notification server is running!");
});

app.use("/push", serverPushRouter);

// Server
const port = process.env.PORT || 4000;

try {
  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Push notification server running at http://localhost:${port}`);
    console.log(`Test the server at: http://localhost:${port}/push`);
  });
} catch (error) {
  console.error("Error starting server:", error);
  app.listen(port, () => {
    console.log(`Server started in fallback HTTP mode on port ${port}`);
  });
}
