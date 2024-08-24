package main

import (
	"fmt"
	"net/http"
)

func (a *app) errorResponse(w http.ResponseWriter, r *http.Request, status int, message any) {
	res := envelope{"error": message}

	err := a.writeJSON(w, status, res, nil)
	if err != nil {
		w.WriteHeader(500)
	}
}

func (a *app) serverBadRequest(w http.ResponseWriter, r *http.Request, err error) {
	m := fmt.Sprintf("Bad Request: %v", err)
	a.errorResponse(w, r, http.StatusBadRequest, m)
}

func (a *app) serverErrorResponse(w http.ResponseWriter, r *http.Request, err error) {
	m := fmt.Sprintf("The server encountered a problem while processing your request: %v", err)
	a.errorResponse(w, r, http.StatusInternalServerError, m)
}

func (a *app) notFoundResponse(w http.ResponseWriter, r *http.Request) {
	m := "The requested resource was not found"
	a.errorResponse(w, r, http.StatusNotFound, m)
}

func (a *app) methodNotAllowed(w http.ResponseWriter, r *http.Request) {
	m := fmt.Sprintf("The %s method is not allowed for this resource", r.Method)
	a.errorResponse(w, r, http.StatusMethodNotAllowed, m)
}
