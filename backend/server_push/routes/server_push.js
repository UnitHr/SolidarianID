import webPush from 'web-push';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Update CORS configuration
router.use(
  cors({
    origin: 'http://localhost:5173', // Change this to the frontend origin
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

// Add middleware for CORS headers
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Change this to the frontend origin
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);

  // For OPTIONS (preflight) requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  next();
});

// In-memory storage for subscriptions
const subscriptions = [];

if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
  throw new Error('Missing VAPID keys');
}

// Set the keys used for encrypting the push messages.
webPush.setVapidDetails(
  'mailto:your_email@example.com', // Change this to your real email
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY,
);

router.get('/', function rootHandler(req, res) {
  res.send('Push System : Working...');
});

router.get('/vapidPublicKey', function vapidPublicKeyHandler(req, res) {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

router.post('/register', function registerHandler(req, res) {
  const { subscription, userId, userRoles } = req.body;

  // Verify that the subscription is valid
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  // Verify that user ID and roles are provided
  if (!userId || !userRoles) {
    return res.status(400).json({ error: 'User ID and roles are required' });
  }

  // Check if the subscription already exists
  const existingSubscriptionIndex = subscriptions.findIndex(
    (sub) => sub.subscription.endpoint === subscription.endpoint,
  );

  // If it exists, update it; otherwise, add it
  if (existingSubscriptionIndex !== -1) {
    subscriptions[existingSubscriptionIndex] = {
      subscription,
      userId,
      userRoles,
    };
  } else {
    subscriptions.push({ subscription, userId, userRoles });
  }

  res.status(201).json({ message: 'Subscription successfully registered' });
});

// Route to send a notification to a specific subscription
router.post('/sendNotification', function sendNotificationHandler(req, res) {
  const { subscription, payload, ttl = 86400, delay = 0 } = req.body;

  // Verify that the subscription is valid
  if (!subscription || !subscription.endpoint) {
    return res.status(400).json({ error: 'Invalid subscription' });
  }

  setTimeout(function sendNotification() {
    webPush
      .sendNotification(subscription, payload, { TTL: ttl })
      .then(function onSuccess() {
        res.status(201).json({ message: 'Notification sent' });
      })
      .catch(function onError(error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Error sending notification' });
      });
  }, delay * 1000);
});

// New route to send notifications to all subscriptions
router.post('/sendToAll', function sendToAllHandler(req, res) {
  const { payload, ttl = 86400 } = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Payload is required' });
  }

  if (subscriptions.length === 0) {
    return res.status(404).json({ error: 'No subscriptions registered' });
  }

  const sendPromises = subscriptions.map((subscription) => {
    return webPush
      .sendNotification(subscription, payload, { TTL: ttl })
      .catch((error) => {
        console.error('Error sending to:', subscription.endpoint, error);
        // If the error is that the subscription has expired, remove it
        if (error.statusCode === 410) {
          const index = subscriptions.findIndex(
            (sub) => sub.endpoint === subscription.endpoint,
          );
          if (index !== -1) {
            subscriptions.splice(index, 1);
            console.log(
              'Subscription removed due to expiration:',
              subscription.endpoint,
            );
          }
        }
        return { error: true, endpoint: subscription.endpoint };
      });
  });

  Promise.all(sendPromises)
    .then((results) => {
      const successful = results.filter(
        (result) => !result || !result.error,
      ).length;
      res.json({
        message: `Notifications sent: ${successful} of ${subscriptions.length}`,
      });
    })
    .catch((error) => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Error sending notifications' });
    });
});

// Route to send notifications only to administrators
router.post('/sendToAdmins', function sendToAdminsHandler(req, res) {
  const { payload, ttl = 86400 } = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Payload is required' });
  }

  // Filter subscriptions where the user role includes 'admin'
  const adminSubscriptions = subscriptions.filter((sub) =>
    sub.userRoles.includes('admin'),
  );

  if (adminSubscriptions.length === 0) {
    return res.status(404).json({ error: 'No administrators subscribed' });
  }

  const sendPromises = adminSubscriptions.map((subscription) => {
    return webPush
      .sendNotification(subscription.subscription, payload, { TTL: ttl })
      .catch((error) => {
        console.error(
          'Error sending to:',
          subscription.subscription.endpoint,
          error,
        );
        // If the error is that the subscription has expired, remove it
        if (error.statusCode === 410) {
          const index = subscriptions.findIndex(
            (sub) =>
              sub.subscription.endpoint === subscription.subscription.endpoint,
          );
          if (index !== -1) {
            subscriptions.splice(index, 1);
            console.log(
              'Subscription removed due to expiration:',
              subscription.subscription.endpoint,
            );
          }
        }
        return { error: true, endpoint: subscription.subscription.endpoint };
      });
  });

  Promise.all(sendPromises)
    .then((results) => {
      const successful = results.filter(
        (result) => !result || !result.error,
      ).length;
      res.json({
        message: `Notifications sent to administrators: ${successful} of ${adminSubscriptions.length}`,
      });
    })
    .catch((error) => {
      console.error('Error sending notifications:', error);
      res.status(500).json({ error: 'Error sending notifications' });
    });
});

// Route to list all subscriptions (useful for debugging)
router.get('/subscriptions', function listSubscriptionsHandler(req, res) {
  res.json({
    count: subscriptions.length,
    subscriptions: subscriptions.map((sub) => ({
      subscription: sub.subscription, // Return the full subscription
      userId: sub.userId, // Include the user ID
      userRoles: sub.userRoles, // Include the user role
    })),
  });
});

// Route to check if a user is subscribed
router.get(
  '/subscription/:userId',
  function checkSubscriptionHandler(req, res) {
    const { userId } = req.params;

    // Check if a subscription exists for the provided userId
    const subscription = subscriptions.find((sub) => sub.userId === userId);

    if (subscription) {
      res.json({ isSubscribed: true, subscription: subscription.subscription });
    } else {
      res.json({ isSubscribed: false });
    }
  },
);

export default router;
