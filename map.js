import fs from "fs";

let lastMap = fs.readFileSync("last-map.txt", "utf-8");
export let backgroundLayer = {};

loadMap(lastMap);

function saveLastMap() {
    fs.writeFileSync("last-map.txt", lastMap);
}

export function loadMap(name) {
    lastMap = name + ".json";
    saveLastMap();

    let output = fs.readFileSync("./maps/" + name, "utf-8");
    backgroundLayer = JSON.parse(output);
}

export function saveMap() {
    fs.writeFileSync("./maps/" + lastMap, JSON.stringify(backgroundLayer));
}

export function getAllMaps() {
    return fs.readdirSync("./maps/").map(a => a.replace(".json", ""));
}