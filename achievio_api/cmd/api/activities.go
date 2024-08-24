package main

import (
	"encoding/json"
	"net/http"

	"achievio/internal/data"
)

type Activity struct {
	ID     string `bson:"_id,omitempty"    json:"id,omitempty"`
	Name   string `bson:"name,omitempty"   json:"name,omitempty"`
	Points int    `bson:"points,omitempty" json:"points,omitempty"`
	Type   string `bson:"type,omitempty"   json:"type,omitempty"`
}

func (act *Activity) GetID() string {
	return act.ID
}

func (act *Activity) SetID(n string) {
	act.ID = n
}

func (a *app) getActivities(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("activity")

	var documents []Activity

	data := internal.GetDocuments(col, &documents)

	a.writeJSON(w, 200, data, nil)
}

func (a *app) createActivity(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("activity")

	var reqBody Activity

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	defer r.Body.Close()

	data, err := internal.PostDocument(col, &reqBody)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}

	a.writeJSON(w, 201, data, nil)
}
