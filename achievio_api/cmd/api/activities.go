package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

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

func ChangeActivity(coll *mongo.Collection, data Activity, ID string) error {
	id, _ := primitive.ObjectIDFromHex(ID)
	filter := bson.D{{Key: "_id", Value: id}}
	update := bson.D{
		{
			Key: "$set",
			Value: bson.D{
				{Key: "name", Value: data.Name},
				{Key: "points", Value: data.Points},
				{Key: "type", Value: data.Type},
			},
		},
	}
	_, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return err
}

func (a *app) getActivities(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("activity")

	var documents []Activity

	data := internal.GetDocuments(col, &documents)

	a.writeJSON(w, 200, data, nil)
}

func (a *app) updateActivity(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("activity")

	var result Activity

	act_id := chi.URLParam(r, "id")

	err := json.NewDecoder(r.Body).Decode(&result)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	defer r.Body.Close()

	err = ChangeActivity(col, result, act_id)
	if err != nil {
		err_msg := errors.New("Error while changing the activity")
		a.serverBadRequest(w, r, err_msg)
	}

	data := a.stoe(result)

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
