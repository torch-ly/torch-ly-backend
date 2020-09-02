import fetch from "node-fetch";
import fs from "fs";

export let monsters = [];

export function loadMonstersFromFile () {
    try {
        monsters = fs.readFileSync("entities/monster/monsters.json","utf-8") || [];
    } catch {
        console.error("monsters.json not available");
    }
}

export const queries = {
    getMonsters: () => {
        return monsters;
    },
}

/*
export async function loadMonstes() {
    let res = await (await fetch("https://5e.tools/data/bestiary/index.json?v=1.110.1")).json();

    let books = Object.entries(res);
    let monstersNew = [];

    for (let book of books) {
        let url = "http://5e.tools/data/bestiary/" + String(book[1]);
        let data = await (await fetch(url)).json()
        console.log("Got data for book", book[0])
        monstersNew.push(data.monster);
    }

    function compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    monstersNew = monstersNew.flat().sort(compare)
}*/