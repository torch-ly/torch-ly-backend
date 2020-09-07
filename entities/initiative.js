import {pubsub} from "../index";
import { default as hash } from "object-hash";

export let initiative = [];

export const queries = {
    getInitiative: () => ({
        order: initiative
    }),
};

export const mutations = {
    updateInitiative: (parent, args) => {

        let updated = hash(initiative) !== hash(args.order);

        console.log(args.order)
        initiative = args.order;

        if (updated)
            pubsub.publish("initiative-update", {updateInitiative: {order: args.order}});

        return {order: args.order};
    },
};

export const subscriptions = {
    updateInitiative: {
        subscribe: () => pubsub.asyncIterator("initiative-update")
    },
};
