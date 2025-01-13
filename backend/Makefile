SHELL := /bin/bash
default: help

# Docker compose files
COMPOSE_DEV_FILE := docker-compose-dev.yml
COMPOSE_PROD_FILE := docker-compose-prod.yml

# Docker commands
run-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) up -d --build

run-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) up -d --build

run-dev-foreground:
	docker-compose -f $(COMPOSE_DEV_FILE) up --build

run-prod-foreground:
	docker-compose -f $(COMPOSE_PROD_FILE) up --build

stop-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) down

stop-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) down

restart-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) down && docker-compose -f $(COMPOSE_DEV_FILE) up -d --build

restart-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) down && docker-compose -f $(COMPOSE_PROD_FILE) up -d --build

# Cleaning
clean-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) down --volumes --remove-orphans

clean-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) down --volumes --remove-orphans

# Utility commands
logs-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) logs -f

logs-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) logs -f

status-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) ps

status-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) ps

build-dev:
	docker-compose -f $(COMPOSE_DEV_FILE) build

build-prod:
	docker-compose -f $(COMPOSE_PROD_FILE) build

# Network
create-network:
	docker network create --driver bridge solidarianid-network

delete-network:
	docker network rm solidarianid-network

# Help
help:
	@echo "Available commands:"
	@echo "  run-dev                - Run development environment in detached mode"
	@echo "  run-prod               - Run production environment in detached mode"
	@echo "  run-dev-foreground     - Run development environment in foreground mode"
	@echo "  run-prod-foreground    - Run production environment in foreground mode"
	@echo "  stop-dev               - Stop development environment"
	@echo "  stop-prod              - Stop production environment"
	@echo "  restart-dev            - Restart development environment"
	@echo "  restart-prod           - Restart production environment"
	@echo "  clean-dev              - Clean development environment (remove volumes and orphans)"
	@echo "  clean-prod             - Clean production environment (remove volumes and orphans)"
	@echo "  logs-dev               - Show logs for development environment"
	@echo "  logs-prod              - Show logs for production environment"
	@echo "  status-dev             - Show status of development environment"
	@echo "  status-prod            - Show status of production environment"
	@echo "  build-dev              - Build development environment"
	@echo "  build-prod             - Build production environment"
	@echo "  create-network         - Create Docker network"
	@echo "  delete-network         - Delete Docker network"
