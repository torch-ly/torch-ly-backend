import {pubsub} from "../index";

export let initiative = [
    {
        id: "5f298f49da955f54d460a603",
        value: 1
    },
    {
        id: "5f4e84a100e1a15b8c582561",
        value: 3
    },
    {
        id: "5f4ec32d84e88f4662e6994c",
        value: 2
    }
];

export const queries = {
    getInitiative: () => ({
        order: initiative
    }),
};

export const mutations = {
    updateInitiative: (parent, args) => {
        console.log(args.order)
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
