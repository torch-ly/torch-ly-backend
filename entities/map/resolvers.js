import {
    backgroundLayer, deleteMap,
    fogOfWar,
    getAllMaps,
    loadMap,
    saveMap,
    setBackgroundLayer,
    setFogOfWar,
    setViewport,
    viewport
} from "./index";
import {pubsub} from "../../index";

export const queries = {
    getBackgroundLayer: () => ({
        layer: backgroundLayer
    }),

    getMaps: () => {
        return getAllMaps();
    },

    getFogOfWar: () => {
        return {polygons: fogOfWar};
    },

    getViewport: () => {
        return {matrix: viewport};
    }
};

export const mutations = {
    updateFogOfWar: (parent, args) => {
        setFogOfWar(args.json);

        saveMap();

        pubsub.publish("fogofwar-update", {updateFogOfWar: {polygons: args.json}})

        return {polygons: fogOfWar};
    },
    updateViewport: (parent, args) => {
        setViewport(args.matrix);

        pubsub.publish("viewport-update", {updateViewport: {matrix: args.matrix}});

        return {matrix: args.matrix};
    },
    updateBackgroundLayer: (parent, args) => {
        setBackgroundLayer(args.layer);

        saveMap();

        pubsub.publish("background-update", {updateBackgroundLayer: args});

        return {layer: backgroundLayer};
    },
    loadMap: (parent, args) => {
        let name = args.name;

        loadMap(name);

        pubsub.publish("background-update", {updateBackgroundLayer: {layer: backgroundLayer}});

        return {layer: backgroundLayer};
    },
    createMap: (parent, args) => {
        saveMap(args.name);
        return getAllMaps();
    },
    deleteMap: (parent, args) => {
        deleteMap(args.name);
        return getAllMaps();
    }
};

export const subscriptions = {
    updateBackgroundLayer: {
        subscribe: () => pubsub.asyncIterator("background-update")
    },
    updateFogOfWar: {
        subscribe: () => pubsub.asyncIterator("fogofwar-update")
    },
    updateViewport: {
        subscribe: () => pubsub.asyncIterator("viewport-update")
    }
};