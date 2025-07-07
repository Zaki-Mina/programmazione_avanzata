import express from "express";
import bodyParser from "body-parser";
import jsonErrorHandler from "./middlewares/jsonErrorHandler";
import dotenv from "dotenv";

import sequelize from "./db/sequelize";
import User from "./models/User";
import GraphController from "./controllers/GraphController";
import ConcreteGraphMediator from "./controllers/ConcreteGraphMediator";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// 1) parsing JSON
app.use(bodyParser.json());

// 2) rotta per ottenere gli utenti
app.get("/users", async (_req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 3) rotte grafo
const mediator = new ConcreteGraphMediator();
const graphController = new GraphController(mediator);
app.use("/", graphController.router);

// 4) error handler
app.use(jsonErrorHandler);

// 5) avvio del server (non cancellare nulla in DB)
sequelize.authenticate()           // solo per verificare la connessione
  .then(() => console.log("DB connesso"))
  .catch(console.error);

app.listen(PORT, () => {
  console.log(` http://localhost:${PORT}`);
});
