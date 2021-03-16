import {deleteMap, getAllMaps, loadMap, saveCurrentMap} from "../file-handler";
import {getBackgroundLayer} from "./backgroundlayer";
import {pubsub} from "../index";

export const queries = {
    getMaps: () => {
        return getAllMaps();
    },
};

export const mutations = {
    loadMap: (parent, args) => {
        loadMap(args.name);

        pubsub.publish("background-update", {updateBackgroundLayer: {layer: getBackgroundLayer()}});

        return {layer: getBackgroundLayer()};
    },
    createMap: (parent, args) => {
        saveCurrentMap(args.name);
        return getAllMaps();
    },
    deleteMap: (parent, args) => {
        deleteMap(args.name);
        return getAllMaps();
    }
};
