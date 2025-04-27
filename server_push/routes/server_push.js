import webPush from "web-push";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const allowedOrigins = ["http://localhost:5173", "http://localhost:4173"];

// CORS configuration
router.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// In-memory storage for subscriptions
const subscriptions = [];

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error("Missing VAPID keys");
}

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  "mailto:admin@admin.com",
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

router.get("/", function rootHandler(req, res) {
  res.send("Push System : Working...");
});

router.get("/vapidPublicKey", function vapidPublicKeyHandler(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post("/register", function registerHandler(req, res) {
  const { subscription, userId } = req.body;

  // Verify that the subscription is valid
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: "Invalid subscription" });
  }

  // Verify that user ID is provided
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  // Check if the subscription already exists
  const existingSubscriptionIndex = subscriptions.findIndex(
    (sub) => sub.subscription.endpoint === subscription.endpoint
  );

  // If it exists, update it; otherwise, add it
  if (existingSubscriptionIndex !== -1) {
    subscriptions[existingSubscriptionIndex] = {
      subscription,
      userId,
    };
  } else {
    subscriptions.push({ subscription, userId });
  }

  res.status(201).json({ message: "Subscription successfully registered" });
});

// Route to list all subscriptions
router.get("/subscriptions", function listSubscriptionsHandler(req, res) {
  res.json({
    count: subscriptions.length,
    subscriptions: subscriptions.map((sub) => ({
      subscription: sub.subscription, // Return the full subscription
      userId: sub.userId, // Include the user ID
    })),
  });
});

router.post("/sendNotification", function sendNotificationHandler(req, res) {
  const { userId, payload, ttl = 86400, delay = 0 } = req.body;

  // Buscar la suscripción del usuario
  const subscriptionEntry = subscriptions.find((sub) => sub.userId === userId);
  console.log("Subscription Entry:", subscriptionEntry);

  if (
    !subscriptionEntry ||
    !subscriptionEntry.subscription ||
    !subscriptionEntry.subscription.endpoint
  ) {
    console.log(`User ${userId} is not subscribed. Skipping notification.`);
    return res
      .status(200)
      .json({ message: "User is not subscribed, notification skipped" });
  }

  const subscription = subscriptionEntry.subscription;
  console.log("Subscription:", subscription);

  setTimeout(function sendNotification() {
    webPush
      .sendNotification(subscription, payload, { TTL: ttl })
      .then(function onSuccess() {
        res.status(201).json({ message: "Notification sent" });
      })
      .catch(function onError(error) {
        console.error("Error sending notification:", error);
        if (error.statusCode === 410 || error.statusCode === 404) {
          // 410 = Gone, 404 = Not Found => Delete the subscription
          console.log(`Deleting subscription for user ${userId}`);
          const index = subscriptions.findIndex((sub) => sub.userId === userId);
          if (index !== -1) {
            subscriptions.splice(index, 1);
          }
        }
        res.status(500).json({ error: "Error sending notification" });
      });
  }, delay * 1000);
});

export default router;
