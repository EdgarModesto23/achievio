package internal

import (
	"context"
	"fmt"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type GenericDocument interface {
	GetID() string
	SetID(n string)
}

func GetDocumentByID[T any](coll *mongo.Collection, documentData *T, ID string) error {
	id, err := primitive.ObjectIDFromHex(ID)
	if err != nil {
		return err
	}
	filter := bson.D{{Key: "_id", Value: id}}
	err = coll.FindOne(context.TODO(), filter).Decode(&documentData)
	if err != nil {
		return err
	}
	return nil
}

func GetDocuments[T any](coll *mongo.Collection, documentData *[]T) map[string]any {
	cursor, err := coll.Find(context.TODO(), bson.D{})
	if err != nil {
		panic(err)
	}

	for cursor.Next(context.TODO()) {
		var d_data T
		if err := cursor.Decode(&d_data); err != nil {
			log.Fatal(err)
		}
		*documentData = append(*documentData, d_data)
	}

	if err := cursor.Err(); err != nil {
		log.Fatal(err)
	}

	data := make(map[string]any)
	data["documents"] = *documentData
	return data
}

func PostDocument(coll *mongo.Collection, data GenericDocument) (map[string]any, error) {
	cp_data := data
	cursor, err := coll.InsertOne(context.TODO(), cp_data)
	if err != nil {
		return nil, err
	}
	insertedID := cursor.InsertedID

	if oid, ok := insertedID.(primitive.ObjectID); ok {
		data.SetID(oid.Hex())
	} else {
		data.SetID(fmt.Sprintf("%v", insertedID))
	}

	res := make(map[string]any)

	res["document"] = data

	return res, nil
}
