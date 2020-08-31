import fetch from "node-fetch";
import fs from "fs";

export let monsters = [];

export function loadMonstersFromFile () {
    monsters = fs.readFileSync("./monsters.json","utf-8") || [];
}

/*
export async function loadMonstes() {
    let res = await (await fetch("https://5e.tools/data/bestiary/index.json?v=1.110.1")).json();

    let books = Object.entries(res);

    for (let book of books) {
        let url = "http://5e.tools/data/bestiary/" + String(book[1]);
        let data = await (await fetch(url)).json()
        console.log("Got data for book", book[0])
        monsters.push(data.monster);
    }

    function compare(a, b) {
        if (a.name < b.name)
            return -1;
        if (a.name > b.name)
            return 1;
        return 0;
    }

    monsters = monsters.flat().sort(compare)

}*/