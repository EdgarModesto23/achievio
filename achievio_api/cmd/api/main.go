package main

import (
	"context"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

const version = "1.0.0"

type config struct {
	port int
	env  string
	dsn  string
}

type app struct {
	config config
	logger *slog.Logger
	db     *mongo.Client
}

func main() {
	var cfg config

	flag.IntVar(&cfg.port, "port", 4000, "API server port")
	flag.StringVar(&cfg.env, "env", "development", "Environment (development|staging|production)")
	flag.StringVar(&cfg.dsn, "db-dsn", os.Getenv("ACHIEVIO_DB_DSN"), "PostgreSQL DSN")
	flag.Parse()
	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	// Call the openDB() helper function (see below) to create the connection pool,
	// passing in the config struct. If this returns an error, we log it and exit the
	// application immediately.

	app := &app{
		config: cfg,
		logger: logger,
	}

	var err error
	app.db, err = openDB(cfg)
	if err != nil {
		logger.Error(err.Error())
		os.Exit(1)
	}

	defer func() {
		if err = app.db.Disconnect(context.Background()); err != nil {
			panic(err)
		}
	}()

	logger.Info("database connection pool established")

	srv := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.port),
		Handler:      app.routes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 10 * time.Second,
		ErrorLog:     slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	logger.Info("starting server", "addr", srv.Addr, "env", cfg.env)

	// Because the err variable is now already declared in the code above, we need
	// to use the = operator here, instead of the := operator.
	err = srv.ListenAndServe()
	logger.Error(err.Error())
	os.Exit(1)
}

func openDB(cfg config) (*mongo.Client, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(cfg.dsn))
	err = client.Ping(ctx, readpref.Primary())
	if err != nil {
		panic(err)
	}
	return client, nil
}
