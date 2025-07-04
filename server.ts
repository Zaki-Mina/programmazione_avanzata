import express from "express";
import bodyParser from "body-parser";
import GraphController from "./controllers/GraphController";
import ConcreteGraphMediator from "./controllers/ConcreteGraphMediator";
import GraphEntity from "./db/GraphEntity";
import sequelize from "./db/sequelize"; 
import jsonErrorHandler from "./middlewares/jsonErrorHandler";


import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware per il parsing JSON
app.use(bodyParser.json());

// Inizializza Mediator e Controller
const mediator = new ConcreteGraphMediator();
const graphController = new GraphController(mediator);
graphController.setMediator(mediator);

// Registra le rotte
app.use("/", graphController.router);
// Middleware globale per gestire JSON malformati
app.use(jsonErrorHandler);

//  Sviluppo: reset completo del DB
sequelize
  .drop()
  .then(() => GraphEntity.sync({ force: true })) // ricrea GraphEntity
  .then(() => {
    console.log(" Tabella 'Graph' cancellata e ricreata correttamente.");

    // Avvia il server
    app.listen(PORT, () => {
      console.log(` Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Errore nella sincronizzazione del database:", error);
  });
