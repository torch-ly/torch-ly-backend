import {pubsub} from "../index";

export let initiative = [];

export const queries = {
    getInitiative: () => {
        return initiative;
    }
};

export const mutations = {
    updateInitiative: (parent, args) => {
        initiative = args.order;

        pubsub.publish("initiative-update", {updateInitiative: {order: args.order}});

        return {order: args.order};
    },
};

export const subscriptions = {
    updateInitiative: {
        subscribe: () => pubsub.asyncIterator("initiative-update")
    },
};
