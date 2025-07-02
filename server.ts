import express from "express";
import bodyParser from "body-parser";
import GraphController from "./controllers/GraphController";
import ConcreteGraphMediator from "./controllers/ConcreteGraphMediator";
import GraphEntity from "./db/GraphEntity";
import sequelize from "./db/sequelize"; 

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Inizializza Mediator e Controller
const mediator = new ConcreteGraphMediator();
const graphController = new GraphController(mediator);
graphController.setMediator(mediator);

// Registra le rotte
app.use("/", graphController.router);

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
