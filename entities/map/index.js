import fs from "fs";

const baseDir = "entities/map/";
const mapDir = baseDir + "maps/";

let lastMap = fs.readFileSync(baseDir + "last-map.txt", "utf-8").replace(".json", "").replace("\n", "").replace("\r", "");

export let backgroundLayer = [];
export let fogOfWar = [];
export let viewport = { scale: { x: 1, y: 1 }, x: 0, y: 0 };

loadMap(lastMap);

function saveLastMap() {
    fs.writeFileSync(baseDir + "last-map.txt", lastMap);
}

function setLastMap(name) {
    lastMap = name ? name + ".json" : lastMap;
}

export function loadMap(name) {
    setLastMap(name);

    let output = JSON.parse(fs.readFileSync(mapDir + lastMap, "utf-8"));

    backgroundLayer = output.bg;
    fogOfWar = output.fog;
}

export function deleteMap(name) {
    if (lastMap.replace(".json", "") === name)
        throw new Error("You cannot delete the last or current map");

    fs.unlinkSync(mapDir + name + ".json");
}

export function saveMap(name) {
    setLastMap(name);

    fs.writeFileSync(mapDir + lastMap, JSON.stringify(name ? [] : getFileContent()));
    saveLastMap();
}

function getFileContent() {
    return {bg: backgroundLayer, fog: fogOfWar}
}

export function setBackgroundLayer (layer) {
    backgroundLayer = layer;
}

export function setFogOfWar (fog) {
    fogOfWar = fog;
}

export function setViewport (matrix) {
    viewport = matrix;
}

export function getAllMaps() {
    return fs.readdirSync(mapDir).map(a => {
        return {
            name: a.replace(".json", ""),
            selected: a === lastMap
        }
    });
}
