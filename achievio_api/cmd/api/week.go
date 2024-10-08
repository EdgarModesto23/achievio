package main

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"achievio/internal/data"
)

type SpendPoints struct {
	Points int    `json:"points"`
	WeekID string `json:"week_id"`
}

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

func GetCurrentWeek(coll *mongo.Collection) (Week, error) {
	var result Week
	filter := bson.D{{Key: "current", Value: true}}
	err := coll.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		return result, err
	}
	return result, nil
}

func getNewCurrent() Week {
	return Week{
		Score:       0,
		Total_score: 0,
		Date:        time.Now().UTC().Format(time.RFC3339),
		Current:     true,
	}
}

func checkAvailablePoints(w Week, pts int) bool {
	if w.Score < pts {
		return false
	}
	return true
}

func spendPoints(w *Week, pts int) bool {
	if !checkAvailablePoints(*w, pts) {
		return false
	}
	w.Score -= pts
	return true
}

func GetWeekByID(coll *mongo.Collection, ID string) (Week, error) {
	var result Week

	err := internal.GetDocumentByID(coll, &result, ID)
	if err != nil {
		return result, err
	}
	return result, nil
}

func AddPtsWeek(w *Week, pts int) {
	w.Score += pts
	w.Total_score += pts
}

func ChangeWeek(coll *mongo.Collection, data Week) error {
	id, _ := primitive.ObjectIDFromHex(data.ID)
	filter := bson.D{{Key: "_id", Value: id}}
	update := bson.D{
		{
			Key: "$set",
			Value: bson.D{
				{Key: "current", Value: data.Current},
				{Key: "date", Value: data.Date},
				{Key: "total_score", Value: data.Total_score},
				{Key: "score", Value: data.Score},
			},
		},
	}
	_, err := coll.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return err
	}
	return err
}

func (a *app) getWeeks(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")

	var documents []Week

	data := internal.GetDocuments(col, &documents)

	a.writeJSON(w, 200, data, nil)
}

func (a *app) addPts(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")

	var reqBody SpendPoints

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	defer r.Body.Close()

	week, err := GetWeekByID(col, reqBody.WeekID)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}

	AddPtsWeek(&week, reqBody.Points)
	err = ChangeWeek(col, week)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}

	data := a.stoe(week)

	a.writeJSON(w, 200, data, nil)
}

func (a *app) nextWeek(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")
	curr, err := GetCurrentWeek(col)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	curr.Current = false
	err = ChangeWeek(col, curr)

	new_curr := getNewCurrent()

	data, err := internal.PostDocument(col, &new_curr)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}

	a.writeJSON(w, 201, data, nil)
}

func (a *app) spendPoints(w http.ResponseWriter, r *http.Request) {
	col := a.db.Database("achievio").Collection("week")

	var reqBody SpendPoints

	err := json.NewDecoder(r.Body).Decode(&reqBody)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	defer r.Body.Close()

	week, err := GetWeekByID(col, reqBody.WeekID)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}

	if !week.Current {
		err_msg := errors.New("You can only spend points on the current week")
		a.serverBadRequest(w, r, err_msg)
		return
	}

	if !spendPoints(&week, reqBody.Points) {
		err_message := errors.New("You don't have enough points to spend")
		a.serverBadRequest(w, r, err_message)
		return
	}
	err = ChangeWeek(col, week)
	if err != nil {
		a.serverErrorResponse(w, r, err)
		return
	}
	data := a.stoe(week)
	a.writeJSON(w, 200, data, nil)
}
