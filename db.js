import { MongoClient } from "mongodb";

export async function setupDB() {
    let user = process.env.DB_USER, pwd = process.env.DB_PASSWORD;

    const mongoURL = process.env.DB || "mongodb://" + user + ":" + pwd + "@" + process.env.DB_HOST + "/torch-ly-backend?authSource=admin";

    console.log(mongoURL);

    const mongoClient = await MongoClient.connect(mongoURL, { useUnifiedTopology: true });

    return mongoClient.db();
}
