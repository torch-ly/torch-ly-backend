import {db} from "../index";
import {ObjectId} from "mongodb";

export const queries = {
    allMeasurements: async (parent, args) => await db.collection("measurement").find().toArray(),
    totalMeasurements: async (parent, args) => await db.collection("measurement").estimatedDocumentCount(),
    getMeasurementsByID: async (parent, args) => await db.collection("measurement").findOne(ObjectId(args.id)),
}