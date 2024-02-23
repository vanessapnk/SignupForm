const { getMongoCollection } = require("./mongodb");

const collectionName = "users";

async function getUserByEmail(email) {
    const collection = await getMongoCollection(collectionName);
    const result = await collection.findOne({ email: email });
    return result;
}

async function getUserById(userId) {
    const collection = await getMongoCollection(collectionName);
    const user = await collection.findOne({ _id: userId });
    return user;
}

module.exports = { getUserByEmail, getUserById };