# Backend SolidarianID

Backend for SolidarianID project.

## Development

This only starts the databases and message broker. You should start the microservices locally.

To start the development environment, run:

```sh
make run-dev
```

To stop the development environment, run:

```sh
make stop-dev
```

To start the microservices locally, run:

```sh
npm run start:dev:api-gateway
npm run start:dev:users-ms
npm run start:dev:communities-ms
npm run start:dev:statistics-ms
```

To see other commands of interest, run:

```sh
make help
```

## Production

To start the production environment, run:

```sh
make run-prod
```

To stop the production environment, run:

```sh
make stop-prod
```

To see other commands of interest, run:

```sh
make help
```
