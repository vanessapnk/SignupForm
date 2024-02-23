const { getUserByEmail } = require("../data/users");
const { getMongoCollection } = require("../data/mongodb");

async function CreateNewUser(newUser) {
    const { email, password, passwordConfirmation } = newUser;

    if (password !== passwordConfirmation) {
        throw new Error('As senhas não coincidem');
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new Error('O endereço introduzido já está registado.');
    }

    const user = {
        email: email,
        password: password
    };

    try {
        const collection = await getMongoCollection('users');
        const result = await collection.insertOne(user);
        return result.ops[0]; 
    } catch (error) {
        throw new Error('Os dados introduzidos não são válidos.');
    }
}

async function Login(loginUser){
    const { email , password } = loginUser

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
        throw new Error('O utilizador não foi encontrado!');
    } else if (password !== password.email._id){
        throw new Error('A password introduzida é inválida!');
    } else {
        const collection = await getMongoCollection('users');
        const result = await collection.insertOne(user.token);
        return result.ops[0]; 
    } 

}

module.exports = { CreateNewUser, Login };