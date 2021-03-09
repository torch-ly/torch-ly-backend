import {fileContent, setFileContent, subscribeOnFileChange} from "../file-handler";
import {pubsub} from "../index";
import uniqid from "uniqid";

// will be called for all background layer updates not caused by the background layer mutations
function updateBackgroundLayer() {
    pubsub.publish("background-update", {updateBackgroundLayer: {layer: getBackgroundLayer()}});
}

export function getBackgroundLayer() {
    return fileContent.bg;
}

function saveUpdatedBackgroundLayer(layer) {
    let content = {bg: layer};

    setFileContent(content);
    updateBackgroundLayer();
}

subscribeOnFileChange(updateBackgroundLayer);

export const queries = {
    getBackgroundLayer: () => ({
        layer: getBackgroundLayer()
    }),
};

export const mutations = {
    updateBackgroundLayer: (parent, args) => {

        for (let obj of args.layer) {
            obj._id = uniqid();
        }

        saveUpdatedBackgroundLayer(args.layer);
        return {layer: getBackgroundLayer()};
    },
    addBackgroundLayerObject: (parent, args) => {

        args._id = uniqid();

        saveUpdatedBackgroundLayer(args.layer);
        return {layer: getBackgroundLayer()};
    },
    removeBackgroundLayerObject: (parent, args) => {
        saveUpdatedBackgroundLayer(args.layer.filter((obj) => obj._id !== args.id));
        return {layer: getBackgroundLayer()};
    }
};

export const subscriptions = {
    updateBackgroundLayer: {
        subscribe: () => pubsub.asyncIterator("background-update")
    },
};
