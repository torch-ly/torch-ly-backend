import fs from "fs";

let lastMap = fs.readFileSync("last-map.txt", "utf-8").replace(".json", "").replace("\n", "").replace("\r", "");

export let backgroundLayer = [];
export let fogOfWar = [];

loadMap(lastMap);

function saveLastMap() {
    fs.writeFileSync("last-map.txt", lastMap);
}

function setLastMap(name) {
    lastMap = name ? name + ".json" : lastMap;
}

export function loadMap(name) {
    setLastMap(name);

    let output = JSON.parse(fs.readFileSync("./maps/" + lastMap, "utf-8"));

    backgroundLayer = output.bg;
    fogOfWar = output.fog;
}

export function deleteMap(name) {
    if (lastMap.replace(".json", "") === name)
        throw new Error("You cannot delete the last or current map");

    fs.unlinkSync("./maps/" + name + ".json");
}

export function saveMap(name) {
    setLastMap(name);

    fs.writeFileSync("./maps/" + lastMap, JSON.stringify(name ? [] : getFileContent()));
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

export function getAllMaps() {
    return fs.readdirSync("./maps/").map(a => {
        return {
            name: a.replace(".json", ""),
            selected: a === lastMap
        }
    });
}
