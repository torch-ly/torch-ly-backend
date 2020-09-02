import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { readFileSync } from "fs";
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from "./resolvers";
import { setupDB } from "./db";
import {loadMonstersFromFile} from "./entities/monster";
import {validateAuthID} from "./entities/players";

require("dotenv").config();

export const pubsub = new PubSub();
const WS_PORT = 5000;
const typeDefs = readFileSync("./schema.graphql", "utf-8");

// does not work due to performance issues
// loadMonstes().then(() => console.log(monsters.slice(10))).catch(console.error);

loadMonstersFromFile()

export let db;

async function setup() {

    const websocketServer = createServer((request, response) => {
        response.writeHead(404);
        response.end();
    });

    websocketServer.listen(WS_PORT, () => console.log(
        `Websocket Server is now running on port ${WS_PORT}`
    ));


    db = await setupDB();

    const schema = makeExecutableSchema({
        typeDefs,
        resolvers
    });

    SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect: (connectionParams) => {
                return validateAuthID(connectionParams.authID)
                    .then(user => {
                        return {
                            currentUser: user,
                        };
                    });
            }
        },
        {
            server: websocketServer,
            path: '/graphql',
        },
    );
}

setup();

process.on('SIGINT', () => db.close());
process.on('SIGTERM', () => db.close());
