import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose, { mongo } from "mongoose";

export const setupConnection = () => {
    let mMongo: any;

    beforeAll(async () => {
        mMongo = await MongoMemoryServer.create();
        const uri = await mMongo.getUri();

        await mongoose.connect(uri);
    });

    afterEach(async () => {
        const collections = mongoose.connection.collections;

        for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({});
        }
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mMongo.stop();
    });
};