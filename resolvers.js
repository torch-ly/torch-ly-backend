import {queries as monsterQueries} from "./entities/monster";
import {queries as mapQueries, mutations as mapMutations} from "./entities/maps";
import {
    queries as initiativeQueries,
    mutations as initiativeMutations,
    subscriptions as initiativeSubscriptions
} from "./entities/initiative";
import {
    queries as characterQueries,
    mutations as characterMutations,
    subscriptions as characterSubscriptions,
    details as characterDetails
} from "./entities/characters";
import {
    queries as backgroundLayerQueries,
    mutations as backgroundLayerMutations,
    subscriptions as backgroundLayerSubscriptions
} from "./entities/backgroundlayer";
import {queries as playerQueries, details as playerDetails} from "./entities/players";
import {queries as measurementQueries} from "./entities/measurements";
import {
    queries as fogOfWarQueries,
    mutations as fogOfWarMutations,
    subscriptions as fogOfWarSubscriptions
} from "./entities/fogofwar";
import {
    queries as viewportQueries,
    mutations as viewportMutations,
    subscriptions as viewportSubscriptions
} from "./entities/viewport";
import {URLResolver, JSONResolver} from 'graphql-scalars';

const resolvers = {
    Query: {
        ...playerQueries,
        ...characterQueries,
        ...measurementQueries,
        ...mapQueries,
        ...monsterQueries,
        ...initiativeQueries,
        ...backgroundLayerQueries,
        ...fogOfWarQueries,
        ...viewportQueries
    },
    Mutation: {
        ...characterMutations,
        ...mapMutations,
        ...initiativeMutations,
        ...backgroundLayerMutations,
        ...fogOfWarMutations,
        ...viewportMutations
    },
    Subscription: {
        ...characterSubscriptions,
        ...initiativeSubscriptions,
        ...backgroundLayerSubscriptions,
        ...fogOfWarSubscriptions,
        ...viewportSubscriptions
    },
    Player: playerDetails,
    Character: characterDetails,
    PositionSquare: {
        rot: parent => parent.rot || 0,
        size: parent => parent.size || 1
    },
    URL: URLResolver,
    JSON: JSONResolver
};

export default resolvers;
