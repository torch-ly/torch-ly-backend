import {pubsub} from "../index";

export let viewport = { scale: { x: 1, y: 1 }, x: 0, y: 0 };

export function setViewport (matrix) {
    viewport = matrix;

    let gqlObject = {matrix: matrix};

    pubsub.publish("viewport-update", {updateViewport: gqlObject});

    return gqlObject;
}

export const queries = {
    getViewport: () => {
        return {matrix: viewport};
    }
};

export const mutations = {
    updateViewport: (parent, args) => setViewport(args.matrix)
};

export const subscriptions = {
    updateViewport: {
        subscribe: () => pubsub.asyncIterator("viewport-update")
    }
};