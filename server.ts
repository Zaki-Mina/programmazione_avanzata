import express from "express";
import bodyParser from "body-parser";
import GraphController from "./controllers/GraphController";
import ConcreteGraphMediator from "./controllers/ConcreteGraphMediator";
import GraphEntity from "./db/GraphEntity";

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Inizializza Mediator e Controller
const mediator = new ConcreteGraphMediator();
const graphController = new GraphController();
graphController.setMediator(mediator);

// Registra le rotte
app.use("/", graphController.router);

// Sincronizza il database (crea la tabella Graph se non esiste)
GraphEntity.sync({ alter: true })
  .then(() => {
    console.log(" Tabella 'Graph' sincronizzata correttamente.");

    // Avvia il server
    app.listen(PORT, () => {
      console.log(` Server avviato su http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error(" Errore nella sincronizzazione del database:", error);
  });
