import { ObjectId } from "mongodb";
import {db, pubsub} from "./index";

let backgroundLayer = require("./backgroundLayerDefault.json");

import {
    URLResolver,
    JSONResolver
} from 'graphql-scalars';

export function validateToken(authID) {
    return new Promise(async (resolve, reject) => {

        let user = await db.collection("players").findOne({authID});

        resolve(user);
    });
}

const resolvers = {
    Query: {
        // Players
        allPlayers: async (parent, args) => await db.collection("players").find().toArray(),
        totalPlayers: async (parent, args) => await db.collection("players").estimatedDocumentCount(),
        getPlayerByID: async (parent, args) => await db.collection("players").findOne(ObjectId(args.id)),
        me: (parent, args, context) => context.currentUser,

        // Characters
        allCharacters: async (parent, args, context) => {
            return await db.collection("characters").aggregate([
                {
                    "$lookup": {
                        "from": "players",
                        "localField": "players",
                        "foreignField": "_id",
                        "as": "players"
                    }
                }
            ]).toArray();
        },
        totalCharacters: async (parent, args) => await db.collection("characters").estimatedDocumentCount(),
        getCharacterByID: async (parent, args) => (await db.collection("characters").aggregate([
            {
                $match: {
                    _id: ObjectId(args.id)
                }
            },{
                "$lookup": {
                    "from": "players",
                    "localField": "players",
                    "foreignField": "_id",
                    "as": "players"
                }

            }
        ]).toArray())[0],

        // Measurements
        allMeasurements: async (parent, args) => await db.collection("measurement").find().toArray(),
        totalMeasurements: async (parent, args) => await db.collection("measurement").estimatedDocumentCount(),
        getMeasurementsByID: async (parent, args) => await db.collection("measurement").findOne(ObjectId(args.id)),

        // Background Layer
        getBackgroundLayer: () => ({
            layer: backgroundLayer
        })

    },
    Mutation: {
        addCharacter: async (parent, args) => {
            let character = {
                ...args,
            };

            character.token = character.token.href;
            for (let i in character.players) {
                character.players[i] = ObjectId(character.players[i]);
            }

            const { insertedIds } = await db.collection("characters").insertOne(character);
            character.id = insertedIds;

            pubsub.publish("character-update", {updateCharacter:character});

            return character;
        },
        updateCharacterPosition: async (parent, args) => {
            let character = (await db.collection("characters").findOneAndUpdate(
                { _id: ObjectId(args.id)},
                {
                    $set: { "pos.point.x": args.x, "pos.point.y": args.y},
                },
                {returnOriginal: false}
            )).value;

            pubsub.publish("character-update", {updateCharacter:character});

            return character;
        },
        updateBackgroundLayer: (parent, args) => {
            backgroundLayer = args.layer;

            pubsub.publish("background-update", {updateBackgroundLayer:args});

            return {layer: backgroundLayer};
        }
    },
    Subscription: {
        updateCharacter: {
            subscribe: () => pubsub.asyncIterator("character-update")
        },
        updateBackgroundLayer: {
            subscribe: () => pubsub.asyncIterator("background-update")
        }
    },
    Player: {
        id: parent => parent.id || parent._id,
        gm: parent => process.env.GM.includes(parent.id || parent._id),
        characters: async (parent, args) => await db.collection("characters").find({
            players: {
                $in: [parent.id || parent._id]
            }
        }).toArray()
    },
    Character: {
        id: parent => parent.id || parent._id,
        players: async (parent, args) => {
            if (parent.players.length === 0)
                return parent.players;

            let res =  typeof parent.players[0].name != "undefined" ? parent.players :
            await db.collection("players").find({
                "_id": {
                    $in: parent.players.map(p => {
                        return ObjectId(p);
                    })
                }
            }).toArray();
            return res
        }
    },
    PositionSquare: {
        rot: parent => parent.rot || 0,
        size: parent => parent.size || 1
    },
    URL: URLResolver,
    JSON: JSONResolver
};

export default resolvers;
