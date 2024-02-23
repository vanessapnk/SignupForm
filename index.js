const express = require("express");
const { usersRouter } = require("./src/api/users");

const app = express();
const PORT = 4040;

app.use(express.json());
app.use("/api", usersRouter);

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));