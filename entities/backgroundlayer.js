import {fileContent, setFileContent, subscribeOnFileChange} from "../file-handler";
import {pubsub} from "../index";

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
        saveUpdatedBackgroundLayer(args.layer);
        return {layer: getBackgroundLayer()};
    },
};

export const subscriptions = {
    updateBackgroundLayer: {
        subscribe: () => pubsub.asyncIterator("background-update")
    },
};