import { ObjectID } from "mongodb";
import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import {
    URLResolver,
    JSONResolver
} from 'graphql-scalars';

export const resolvers = {
    Query: {
        // Players
        allPlayers: async (parent, args, { db }) => await db.collection("players").find().toArray(),
        totalPlayers: async (parent, args, { db }) => await db.collection("players").estimatedDocumentCount(),
        getPlayerByID: async (parent, args, { db }) => await db.collection("players").findOne(ObjectID(args.id)),

        // Characters
        allCharacters: async (parent, args, { db }) => await db.collection("characters").find().toArray(),
        totalCharacters: async (parent, args, { db }) => await db.collection("characters").estimatedDocumentCount(),
        getCharacterByID: async (parent, args, { db }) => await db.collection("characters").findOne(ObjectID(args.id)),

        // Measurements
        allMeasurements: async (parent, args, { db }) => await db.collection("measurement").find().toArray(),
        totalMeasurements: async (parent, args, { db }) => await db.collection("measurement").estimatedDocumentCount(),
        getMeasurementsByID: async (parent, args, { db }) => await db.collection("measurement").findOne(ObjectID(args.id))

    },/*
    Mutation: {
        addPhoto: async (parent, args, { db }) => {
            let photo = {
                ...args,
            };

            const { insertedIds } = await db.collection("photos").insertOne(photo);
            photo.id = insertedIds;

            return photo;
        }
    },*/

    Player: {
        id: parent => parent.id || parent._id
    },
    URL: URLResolver,
    JSON: JSONResolver
};
