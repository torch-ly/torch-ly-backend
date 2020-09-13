import {fileContent, setFileContent, subscribeOnFileChange} from "../file-handler";
import {pubsub} from "../index";

// will be called for all background layer updates not caused by the background layer mutations
function updateFogOfWar() {
    pubsub.publish("fogofwar-update", {updateFogOfWar: {polygons: getFogOfWar()}});
}

function getFogOfWar() {
    return fileContent.fog;
}

function saveUpdatedFogOfWar(fog) {
    let content = {fog: fog};

    setFileContent(content);
    updateFogOfWar();
}

subscribeOnFileChange(updateFogOfWar);

export const queries = {
    getFogOfWar: () => {
        return {polygons: getFogOfWar()};
    }
};

export const mutations = {
    updateFogOfWar: (parent, args) => {
        saveUpdatedFogOfWar(args.json);
        return {polygons: getFogOfWar()};
    },
};

export const subscriptions = {
    updateFogOfWar: {
        subscribe: () => pubsub.asyncIterator("fogofwar-update")
    },
}
