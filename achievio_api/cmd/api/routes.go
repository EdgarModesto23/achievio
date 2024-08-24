package main

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (a *app) routes() http.Handler {
	r := chi.NewMux()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	r.Get("/weeks", a.getWeeks)
	r.Post("/next-week", a.nextWeek)
	r.Post("/next-week-spend", a.nextWeek)

	return r
}
