import { MongoClient } from "mongodb";

export async function setupDB () {
    let user = process.env.DB_USER, pwd = process.env.DB_PASSWORD;

    const mongoURL = "mongodb://" + user + ":" + pwd + "@" + process.env.DB_HOST + "/torch-ly-backend?authSource=admin";

    const mongoClient = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });

    return mongoClient.db();
}
