import {pubsub} from "../index";
import { default as hash } from "object-hash";

let initiative = [];

export const queries = {
    getInitiative: () => ({
        order: initiative
    }),
};

export const mutations = {
    updateInitiative: (parent, args) => {

        let updated = hash(initiative) !== hash(args.order);

        initiative = args.order;

        if (updated)
            pubsub.publish("initiative-update", {updateInitiative: {order: args.order}});

        return {order: args.order};
    },

    addToInitiative: (parent, args) => {

        let characterAlreadyInOrder = initiative.filter(a => a.id === args.id).length > 0;

        if (characterAlreadyInOrder)

            initiative.filter(a => a.id === args.id)[0].value = args.value;

        else

            initiative.push({
                id: args.id,
                value: args.value
            });

        pubsub.publish("initiative-update", {updateInitiative: {order: initiative   }});

        return {order: initiative};
    }
};

export const subscriptions = {
    updateInitiative: {
        subscribe: () => pubsub.asyncIterator("initiative-update")
    },
};
