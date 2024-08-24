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

	// Weeks routes
	r.Get("/weeks", a.getWeeks)
	r.Post("/next-week", a.nextWeek)
	r.Post("/spend", a.spendPoints)
	r.Post("/add-pts", a.addPts)

	// Activities routes
	r.Get("/activities", a.getActivities)
	r.Post("/activities", a.createActivity)

	return r
}
