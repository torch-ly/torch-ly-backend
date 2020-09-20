import {db, pubsub} from "../index";
import { default as hash } from "object-hash";
import {fileContent} from "../file-handler";
import uniqid from "uniqid";
import {ObjectId} from "mongodb";

let drawings = [];

function getDrawingByID(id) {
    let drawing = drawings.filter(a => a._id === id)[0]

    if (!drawing)
        throw new Error("Drawing not found");

    return drawing;
}

export const queries = {
    getAllDrawingObjects: () => drawings,
};

export const mutations = {
    addDrawing: (parent, args) => {
        let newDrawing = {
            ...args.object,
            "_id": uniqid()
        };

        drawings.push(newDrawing);

        pubsub.publish("drawings-update", {updateDrawing: {object: newDrawing}});

        return drawings;
    },
    removeDrawing: (parent, args) => {
        let id = args.id;

        let newDrawings = drawings.filter(c => c._id !== id);

        let removed = newDrawings.length < drawings.length;

        if (removed) {
            pubsub.publish("drawings-removed", {removeDrawing: id});
            drawings = newDrawings;
        }

        return removed;
    },
    clearAllDrawings: () => {
        let notEmpty = drawings.length > 0;

        if (notEmpty) {
            pubsub.publish("clear-all-drawings", {clearAllDrawings: true});
            drawings = [];
        }

        return notEmpty;
    }
};

export const subscriptions = {
    updateDrawing: {
        subscribe: () => pubsub.asyncIterator("drawings-update")
    },
    removeDrawing: {
        subscribe: () => pubsub.asyncIterator("drawings-removed")
    },
    clearAllDrawings: {
        subscribe: () => pubsub.asyncIterator("clear-all-drawings")
    }
};
