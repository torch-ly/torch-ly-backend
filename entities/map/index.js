/*import fs from "fs";

const baseDir = "entities/map/";

export function loadMap(name) {
    setLastMap(name);

    let output = JSON.parse(fs.readFileSync(mapDir + lastMap, "utf-8"));

    backgroundLayer = output.bg;
    fogOfWar = output.fog;
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

*/