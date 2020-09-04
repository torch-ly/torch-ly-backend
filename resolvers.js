import {queries as monsterQueries} from "./entities/monster";
import {queries as mapQueries, mutations as mapMutations, subscriptions as mapSubscriptions} from "./entities/map/resolvers";
import {queries as initiativeQueries, mutations as initiativeMutations, subscriptions as initiativeSubscriptions} from "./entities/initiative";
import {
    queries as characterQueries,
    mutations as characterMutations,
    subscriptions as characterSubscriptions,
    details as characterDetails
} from "./entities/character";
import {queries as playerQueries, details as playerDetails} from "./entities/players";
import {queries as measuementQueries} from "./entities/measurements";
import {URLResolver, JSONResolver} from 'graphql-scalars';

const resolvers = {
    Query: {
        ...playerQueries,
        ...characterQueries,
        ...measuementQueries,
        ...mapQueries,
        ...monsterQueries,
        ...initiativeQueries,
    },
    Mutation: {
        ...characterMutations,
        ...mapMutations,
        ...initiativeMutations,
    },
    Subscription: {
        ...characterSubscriptions,
        ...mapSubscriptions,
        ...initiativeSubscriptions,
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
