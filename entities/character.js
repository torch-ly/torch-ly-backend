import {db, pubsub} from "../index";
import {ObjectId} from "mongodb";

export const queries = {
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
        }, {
            "$lookup": {
                "from": "players",
                "localField": "players",
                "foreignField": "_id",
                "as": "players"
            }

        }
    ]).toArray())[0],
};

export const mutations = {
    addCharacter: async (parent, args) => {
        let character = {
            ...args,
        };

        character.token = character.token.href;
        for (let i in character.players) {
            character.players[i] = ObjectId(character.players[i]);
        }

        const {insertedIds} = await db.collection("characters").insertOne(character);
        character.id = insertedIds;

        pubsub.publish("character-update", {updateCharacter: character});

        return character;
    },
    setCharacterRotationAndSize: async (parent, args) => {
        let character = (await db.collection("characters").findOneAndUpdate(
            { _id: ObjectId(args.id)},
            {
                $set: {
                    "pos.size": args.size,
                    "pos.rot": args.rot,
                },
            },
            {returnOriginal: false}
        )).value;

        pubsub.publish("character-update", {updateCharacter: character});

        return character;
    },
    updateCharacterPosition: async (parent, args) => {
        let character = (await db.collection("characters").findOneAndUpdate(
            {_id: ObjectId(args.id)},
            {
                $set: {"pos.point.x": args.x, "pos.point.y": args.y},
            },
            {returnOriginal: false}
        )).value;

        pubsub.publish("character-update", {updateCharacter: character});

        return character;
    },
    removeCharacter: async (parent, args) => {
        let removed = await db.collection("characters").deleteOne(
            {_id: ObjectId(args.id)}
        )

        return removed.nRemoved > 0;
    },
};

export const subscriptions = {
    updateCharacter: {
        subscribe: () => pubsub.asyncIterator("character-update")
    },
};

export const details = {
    id: parent => parent.id || parent._id,
    players: async (parent, args) => {
        if (parent.players.length === 0)
            return parent.players;

        let res = typeof parent.players[0].name != "undefined" ? parent.players :
            await db.collection("players").find({
                "_id": {
                    $in: parent.players.map(p => {
                        return ObjectId(p);
                    })
                }
            }).toArray();
        return res
    }
};