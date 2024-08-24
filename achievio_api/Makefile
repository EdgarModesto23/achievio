build:
	go build -o ./bin/api.out ./cmd/api/

dev:
	./bin/api.out -port 8004 -db-dsn mongodb://localhost:27017 


refresh: build dev
