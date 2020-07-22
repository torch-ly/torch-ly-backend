import { MongoClient } from "mongodb";

export async function setupDB () {
    const mongoURL = "mongodb+srv://erichier:19Eric03@cluster0-zxqj0.mongodb.net/test"

    const mongoClient = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });
    return mongoClient.db();
}