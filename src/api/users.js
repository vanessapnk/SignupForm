const { Router } = require("express");
const { CreateNewUser } = require("../services/users");
const { uuid } = require('uuidv4');
const { getUserByEmail, getUserById } = require("../data/users");


const usersRouter = Router();

//SIGNUP
usersRouter.post("/auth/signup", async (req, res) => {
    try {
        const newUser = req.body;
        const createdUser = await CreateNewUser(newUser);
        res.status(201).json({
            "message": "Utilizador Criado com Sucesso!",
            "_id": await createdUser._id
        }); // Esta a demorar a aparecer a mensagem mas resulta
    } catch (err) {

        const mensagem = 'Os dados introduzidos não são válidos.'
        console.log(err); // Apenas para registro de logs, você pode remover se preferir
        if (err.message === 'As senhas não coincidem') {
            return res.status(500).json({ mensagem: mensagem, error: 'As senhas não coincidem' });
        } else if (err.message === "O endereço introduzido já está registado.") {
            return res.status(500).json({ mensagem: mensagem, error: "O endereço introduzido já está registado." });
        }
    }
});

//LOGIN

let sessions = [];

usersRouter.post("/auth/login", async (req, res) => {

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    if (!user) {
        return res.status(404).json({ "message": "O utilizador não foi encontrado!" });
    }

    if (password !== user.password) {
        return res.status(401).json({ "message": "A password introduzida é inválida!" });
    }

    const token = uuid();

    sessions.push({ token, userId: user.id });

    res.status(200).json({ token });

});

//verificar o header: Authorization e verificar se existe alguma sessão com o token recebido nesse header
usersRouter.get("/user", async (req, res) => {

    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({ "message": "Não foi enviado o token de autenticação!" });
    } else {
        const session = sessions.find(session => session.token === token);
        if (session) {

            const { userId } = session;
            const user = await getUserById(userId);
            res.status(200).json({ _id: userId, email: user.email });
        } else {
            res.status(403).json({ "message": "Não existe nenhuma sessão com o token indicado!" });
        }
    }
    });


module.exports = { usersRouter };

/* 

usersRouter.post("user/:id", async (req, res) => {
    
}) */

