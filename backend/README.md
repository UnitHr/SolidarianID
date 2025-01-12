# Backend SolidarianID

Backend for SolidarianID project.

## Development

This only starts the databases and message broker. You should start the microservices locally.

To start the development environment, run:

```sh
docker-compose -f docker-compose-dev.yml up --build -d
```

To stop the development environment, run:

```sh
docker-compose -f docker-compose-dev.yml down -v
```

## Production

To start the production environment, run:

```sh
docker-compose -f docker-compose-prod.yml up --build -d
```

To stop the production environment, run:

```sh
docker-compose -f docker-compose-prod.yml down -v
```
