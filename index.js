import { PubSub } from 'graphql-subscriptions';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { readFileSync } from "fs";
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from "./resolvers";
import { setupDB } from "./db";

require("dotenv").config();

export const pubsub = new PubSub();
const WS_PORT = 5000;
const typeDefs = readFileSync("./schema.graphql", "utf-8");

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

    const subscriptionServer = SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
        },
        {
            server: websocketServer,
            path: '/graphql',
        },
    );
}

setup();

process.on('SIGINT', () => context.db.close());
process.on('SIGTERM', () => context.db.close());
