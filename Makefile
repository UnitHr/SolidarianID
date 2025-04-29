SHELL := /bin/bash
default: help

# Docker commands
run-prod:
	$(MAKE) -C backend run-prod
	$(MAKE) -C frontend run-prod
	$(MAKE) -C server_push run-prod

run-foreground-prod:
	$(MAKE) -C backend run-foreground-prod
	$(MAKE) -C frontend run-foreground-prod
	$(MAKE) -C server_push run-foreground-prod

stop-prod:
	$(MAKE) -C backend stop-prod
	$(MAKE) -C frontend stop-prod
	$(MAKE) -C server_push stop-prod

restart-prod:
	$(MAKE) -C backend restart-prod
	$(MAKE) -C frontend restart-prod
	$(MAKE) -C server_push restart-prod

status-prod:
	$(MAKE) -C backend status-prod
	$(MAKE) -C frontend status-prod
	$(MAKE) -C server_push status-prod

build-prod:
	$(MAKE) -C backend build-prod
	$(MAKE) -C frontend build-prod
	$(MAKE) -C server_push build-prod

# Cleaning
clean-prod:
	$(MAKE) -C backend clean-prod
	$(MAKE) -C frontend clean-prod
	$(MAKE) -C server_push clean-prod

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
	@echo "  status-prod            - Show status of production environment"
	@echo "  build-prod             - Build production environment"
	@echo "  clean-prod             - Clean production environment (remove volumes and orphans)"
	@echo "  create-network         - Create Docker network"
	@echo "  delete-network         - Delete Docker network"