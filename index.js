import { ApolloServer } from "apollo-server-express";
import { readFileSync } from "fs";
import { resolvers } from "./resolvers";
import { default as playground } from "graphql-playground-middleware-express";
import express from "express";
import { setupDB } from "./db";

const app = express();

async function setup () {
    let context = { db: await setupDB() };
    
    const typeDefs = readFileSync("./schema.graphql", "utf-8"); 
    const server = new ApolloServer({ typeDefs, resolvers, context });
    server.applyMiddleware({ app });

    app.get("/", (req, res) => res.end("Welcome to my API"));
    app.get("/playground", playground({endpoint: "/graphql"}));

    app.listen({port: 4000}, () => console.info(`GraphQL Sevrer running @ http://localhost:4000${server.graphqlPath}`))
}

setup();