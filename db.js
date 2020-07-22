import { MongoClient } from "mongodb";

export async function setupDB () {
    const mongoURL = "mongodb://" + process.env.DB_HOST + "/torch-ly-backend-global";

    const mongoClient = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    return mongoClient.db();
}
