import {pubsub} from "../index";
import { default as hash } from "object-hash";

export const queries = {
}

export const mutations = {
    pointTo: (parent, args) => {
        let pointer = args.pointer;
        pubsub.publish("pointer-update", {updatePointTo: {point: {x: pointer.point.x, y: pointer.point.y}, color: pointer.color}});

        return {point: {x: pointer.point.x, y: pointer.point.y}, color: pointer.color};
    },
};

export const subscriptions = {
    updatePointTo: {
        subscribe: () => pubsub.asyncIterator("pointer-update")
    },
};
