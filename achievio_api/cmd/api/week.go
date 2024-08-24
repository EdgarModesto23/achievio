package main

import (
	"achievio/internal/data"
	"encoding/json"
	"net/http"
)

type Week struct {
	ID          string `bson:"_id,omitempty" json:"id,omitempty"`
	Score       int    `bson:"score"         json:"score"`
	Date        string `bson:"date"          json:"date"`
	Total_score int    `bson:"total_score"   json:"total_score"`
	Current     bool   `bson:"current"       json:"current"`
}

func (week *Week) GetID() string {
	return week.ID
}

func (week *Week) SetID(n string) {
	week.ID = n
}

func (a *app) getWeeks(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")

	var documents []Week

	data := internal.GetDocuments(col, &documents)

	a.writeJSON(w, 200, data, nil)
}

func (a *app) nextWeek(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")
	var body Week
	decoder := json.NewDecoder(r.Body)
	err := decoder.Decode(&body)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	defer r.Body.Close()

	data, err := internal.PostDocument(col, &body)
	if err != nil {
		a.serverErrorResponse(w, r, err)
	}

	a.writeJSON(w, 201, data, nil)
}
