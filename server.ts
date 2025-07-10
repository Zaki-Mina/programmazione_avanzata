import express from "express";
import bodyParser from "body-parser";
import jsonErrorHandler from "./middlewares/jsonErrorHandler";
import dotenv from "dotenv";
import SequelizeSingleton from "./db/sequelize";
const sequelize = SequelizeSingleton.getInstance();

import User from "./models/User";
import GraphController from "./controllers/GraphController";

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
const graphController = new GraphController();
app.use("/", graphController.router);

// 4) error handler
app.use(jsonErrorHandler);

// 5) avvio del server 
sequelize.authenticate()
  .then(async () => {
    console.log("DB connesso");

    await sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Errore di connessione al DB:", err);
  });
