# Frontend SolidarianID

Frontend for the SolidarianID project.

## Development

To start the development environment locally, run:

```bash
npm install
npm run dev
```

This will start the app at:

[http://localhost:5173](http://localhost:5173)

The frontend expects the backend API to be running at [http://localhost:3000](http://localhost:3000).

## Build

To create a production-ready build, run:

```bash
npm run build
```

To preview the production build locally, run:

```bash
npm run preview
```

This will serve the built application at:

[http://localhost:4173](http://localhost:4173)

## Useful Commands

| Command                   | Description                      |
| ------------------------- | -------------------------------- |
| `npm run dev`             | Start the development server     |
| `npm run build`           | Build the app for production     |
| `npm run preview`         | Preview the production build     |
| `npm run lint:fix`        | Run ESLint checks and fix issues |
| `npm run prettier:format` | Format code using Prettier       |

## Features

- User Profiles with support for follow/unfollow
- Communities, Causes, and Actions management
- Contributions to actions
- Authentication with JWT
- GraphQL integration for optimized user fetching
- Pagination for lists
- Responsive UI built with React Bootstrap and Lucide

> **Note:** Make sure the backend is running before starting the frontend.
