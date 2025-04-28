# GraphQL Hooks

This directory contains React hooks for working with GraphQL operations using Apollo Client. These hooks provide a more React-friendly way to work with GraphQL compared to using the Apollo Client directly.

## Benefits of Using the Hooks Approach

- **React Integration**: Hooks integrate with React's component lifecycle
- **Automatic Cache Updates**: Apollo Client cache is managed automatically
- **Declarative Pattern**: Cleaner, more declarative code
- **Loading & Error States**: Built-in handling for loading and error states
- **Improved Performance**: Optimized re-renders and cache management

## Available Hooks

### User Hooks

- `useUserById(id)`: Fetches a user by ID
- `useRegisterUser()`: Handles user registration

### Community Hooks

- `useCommunityById(id)`: Fetches community details by ID

### Notification Hooks

- `useNotificationSubscription(userId, onReceived, onError)`: Subscribes to real-time notifications

## Usage Examples

### Fetching a User

```jsx
import { useUserById } from '../lib/hooks';

function UserProfile({ userId }) {
  const { loading, error, user } = useUserById(userId);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>
        {user.firstName} {user.lastName}
      </h1>
      <p>{user.bio}</p>
    </div>
  );
}
```

### User Registration

```jsx
import { useRegisterUser } from '../lib/hooks';

function RegisterForm() {
  const { registerUser, loading, error } = useRegisterUser();
  const [formData, setFormData] = useState({...});

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      // Registration success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>Register</button>
    </form>
  );
}
```

### Using Subscriptions

```jsx
import { useNotificationSubscription } from '../lib/hooks';

function NotificationComponent({ userId }) {
  const [notifications, setNotifications] = useState([]);

  const handleNewNotification = useCallback((notification) => {
    setNotifications((prev) => [...prev, notification]);
  }, []);

  useNotificationSubscription(userId, handleNewNotification, (error) => console.error(error));

  return (
    <div>
      {notifications.map((n) => (
        <div key={n.id}>{n.message}</div>
      ))}
    </div>
  );
}
```

## Best Practices

1. Always handle loading and error states in the UI
2. Use the `skip` option when a query should not be executed right away
3. Prefer `fetchPolicy: 'cache-and-network'` for user-initiated actions
4. Use React's `useCallback` for event handlers in subscription hooks

## Adding New Hooks

When adding a new hook:

1. Create it in the appropriate file (or create a new file)
2. Export it from `index.ts`
3. Document the hook in this README
