SHELL := /bin/bash
default: help

# Docker compose files
COMPOSE_FILE := docker-compose.yml

# Docker commands
run-prod:
	docker-compose -f $(COMPOSE_FILE) up -d --build

run-foreground-prod:
	docker-compose -f $(COMPOSE_FILE) up --build

stop-prod:
	docker-compose -f $(COMPOSE_FILE) down

restart-prod:
	docker-compose -f $(COMPOSE_FILE) down && docker-compose -f $(COMPOSE_FILE) up -d --build

# Cleaning
clean-prod:
	docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans

# Utility commands
logs-prod:
	docker-compose -f $(COMPOSE_FILE) logs -f

status-prod:
	docker-compose -f $(COMPOSE_FILE) ps

build-prod:
	docker-compose -f $(COMPOSE_FILE) build

# Network
create-network:
	docker network create --driver bridge solidarianid-network

delete-network:
	docker network rm solidarianid-network
	
# Help
help:
	@echo "Available commands:"
	@echo "  run-prod               - Run production environment in detached mode"
	@echo "  run-foreground-prod    - Run production environment in foreground mode"
	@echo "  stop-prod              - Stop production environment"
	@echo "  restart-prod           - Restart production environment"
	@echo "  clean-prod             - Clean production environment (remove volumes and orphans)"
	@echo "  logs-prod              - Show logs for production environment"
	@echo "  status-prod            - Show status of production environment"
	@echo "  build-prod             - Build production environment"
	@echo "  create-network         - Create Docker network"
	@echo "  delete-network         - Delete Docker network"