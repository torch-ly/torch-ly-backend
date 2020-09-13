import {ObjectId} from "mongodb";
import {db, pubsub} from "../index"
import {fileContent, setFileContent} from "../file-handler";
import uniqid from "uniqid";

function updateCharacter(character) {
    pubsub.publish("character-update", {updateCharacter: character});
}

function saveCharacters(characters) {
    setFileContent({characters: characters || fileContent.characters});
}

function addCharacter(character) {
    fileContent.characters.push(character)

    pubsub.publish("character-update", {updateCharacter: character});
}

function getCharacterByID(id) {
    let character = fileContent.characters.filter(a => a._id === id)[0]

    if (!character)
        throw new Error("Character not found");

    return character;
}

export const queries = {
    allCharacters: () => {
        return fileContent.characters;
    },
    totalCharacters: () => fileContent.characters.length,
    getCharacterByID: (parent, args) => {
        return fileContent.characters.filter(a => a._id === args.id)[0]
    },
};

export const mutations = {
    addCharacter: async (parent, args) => {
        let character = {
            ...args,
            "_id": uniqid()
        };

        character.token = character.token.href;

        addCharacter(character);

        saveCharacters();

        return character;
    },
    setCharacterRotationAndSize: (parent, args) => {
        let character = getCharacterByID(args.id)

        character.pos.rot = args.rot;
        character.pos.size = args.size;

        pubsub.publish("character-update", {updateCharacter: character});

        saveCharacters();

        return character;
    },
    updateCharacterPosition: (parent, args) => {
        let character = getCharacterByID(args.id)

        character.pos.point.x = args.x;
        character.pos.point.y = args.y;

        pubsub.publish("character-update", {updateCharacter: character});

        saveCharacters();

        return character;
    },
    removeCharacter: async (parent, args) => {
        let id = args.id;

        let newCharacters = fileContent.characters.filter(c => c._id !== id);

        let removed = newCharacters.length < fileContent.characters.length;

        if (removed) {
            pubsub.publish("character-removed", id);
            saveCharacters(newCharacters);
        }

        return removed;
    },
    setCharacterPlayers: async (parent, args) => {
        let character = getCharacterByID(args.id);

        character.players = args.players;

        updateCharacter(character);

        return character;
    }
};

export const subscriptions = {
    updateCharacter: {
        subscribe: () => pubsub.asyncIterator("character-update")
    },
    removeCharacter: {
        subscribe: () => pubsub.asyncIterator("character-removed")
    }
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
