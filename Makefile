# Makefile for Log Management Appliance

.PHONY: setup start stop clean seed test

setup:
	@echo "Setting up environment..."
	cp .env.example .env 2>/dev/null || true
	chmod +x run.sh samples/*.sh tests/*.sh

start:
	@echo "Starting Appliance..."
	./run.sh

stop:
	@echo "Stopping Appliance..."
	docker-compose down

seed:
	@echo "Seeding sample data..."
	./samples/seed_logs.sh

syslog:
	@echo "Sending Syslog UDP..."
	./samples/send_syslog.sh

test:
	@echo "Running tests..."
	./tests/api_test.sh

clean:
	@echo "Cleaning up..."
	docker-compose down -v
	rm -rf pg_data