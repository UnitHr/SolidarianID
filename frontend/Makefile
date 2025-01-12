SHELL := /bin/bash
default: help

# Docker compose files
COMPOSE_FILE := docker-compose-prod.yml

# Docker commands
run:
	docker-compose -f $(COMPOSE_FILE) up -d --build

run-foreground:
	docker-compose -f $(COMPOSE_FILE) up --build

stop:
	docker-compose -f $(COMPOSE_FILE) down

restart:
	docker-compose -f $(COMPOSE_FILE) down && docker-compose -f $(COMPOSE_FILE) up -d --build

# Cleaning
clean:
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans

# Utility commands
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

status:
	docker-compose -f $(COMPOSE_FILE) ps

build:
	docker-compose -f $(COMPOSE_FILE) build

# Help
help:
	@echo "Available commands:"
	@echo "  run               - Run production environment in detached mode"
	@echo "  run-foreground    - Run production environment in foreground mode"
	@echo "  stop              - Stop production environment"
	@echo "  restart           - Restart production environment"
	@echo "  clean             - Clean production environment (remove volumes and orphans)"
	@echo "  logs              - Show logs for production environment"
	@echo "  status            - Show status of production environment"
	@echo "  build             - Build production environment"
