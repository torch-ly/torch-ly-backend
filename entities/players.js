import {db} from "../index";
import {ObjectId} from "mongodb";

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

export function validateAuthID(authID) {
    return new Promise(async (resolve, reject) => {
        let user = await db.collection("players").findOne({authID});
        resolve(user);
    });
}