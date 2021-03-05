import {db, pubsub} from "../index";
import {ObjectId} from "mongodb";
import cryptoRandomString from "crypto-random-string";

export const queries = {
    allPlayers: async (parent, args) => await db.collection("players").find().toArray(),
    totalPlayers: async (parent, args) => await db.collection("players").estimatedDocumentCount(),
    getPlayerByID: async (parent, args) => await db.collection("players").findOne(ObjectId(args.id)),
    me: (parent, args, context) => context.currentUser,
}

export const details = {
    id: parent => parent.id || parent._id,
    gm: parent => process.env.GM.includes(parent.id || parent._id),
    characters: async (parent, args) => await db.collection("characters").find({
        players: {
            $in: [parent.id || parent._id]
        }
    }).toArray()
};

export const mutations = {
    addPlayer: async (parent, args) => {

        await db.collection("players").insert({
            name: args.name,
            authID: cryptoRandomString(87) // generate random authID
        });

        let player = {
            name: args.name,
            id: "temp",
            gm: args.gm
        };

        pubsub.publish("player-update", {updatePlayer: player});

        return player;
    },
    removePlayer: async (parent, args) => {

        let id = parent.id;

        await db.collection("players").deleteOne( {"_id": ObjectId(id)});

        pubsub.publish("player-removed", {removePlayer: id});

        return true;
    },
};

export const subscriptions = {
    updatePlayer: {
        subscribe: () => pubsub.asyncIterator("player-update")
    },
    removePlayer: {
        subscribe: () => pubsub.asyncIterator("player-removed")
    }
};

export function validateAuthID(authID) {
    return new Promise(async (resolve, reject) => {
        let user = await db.collection("players").findOne({authID});
        resolve(user);
    });
}
