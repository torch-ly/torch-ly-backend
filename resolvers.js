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
        allCharacters: async (parent, args, { db }) => {
            let characters = await db.collection("characters").aggregate([
                {
                    "$lookup": {
                        "from": "players",
                        "localField": "players",
                        "foreignField": "_id",
                        "as": "players"
                    }
                }
            ]).toArray();
            console.log(characters);
            return characters;

        },
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
        id: parent => parent.id || parent._id,
        gm: parent => process.env.GM.includes(parent.id || parent._id),
        characters: async (parent, args, { db }) => await db.collection("characters").find({
            players: {
                $in: [parent.id || parent._id]
            }
        }).toArray()
    },
    Character: {
        id: parent => parent.id || parent._id,
        players: async (parent, args, { db }) => await db.collection("players").find({
            "_id": {
                $in: parent.players.map(p => ObjectID(p))
            }
        }).toArray()
    },
    PositionSquare: {
        rot: parent => parent.rot || 0,
        size: parent => parent.size || 1
    },
    URL: URLResolver,
    JSON: JSONResolver
};
