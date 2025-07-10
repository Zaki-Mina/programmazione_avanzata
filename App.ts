import express, { Application } from "express";
import BaseController from "./controllers/BaseController";
import dotenv from "dotenv";
import SequelizeSingleton from "./db/sequelize";
import jsonErrorHandler from "./middlewares/jsonErrorHandler";

class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = express();
    dotenv.config();
    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private initializeDatabase() {
    const sequelize = SequelizeSingleton.getInstance();
    sequelize.authenticate()
      .then(() => console.log("DB connesso"))
      .catch(err => console.error("Errore di connessione al DB:", err));
  }

  private initializeMiddlewares() {
    this.app.use(express.json()); // Sostituisce body-parser
  }

  private initializeControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(jsonErrorHandler);
  }

  public async start() {
    const port = process.env.PORT || 3000;
    
    // Sincronizza modelli DB (senza cancellare dati)
    await SequelizeSingleton.getInstance().sync(); 
    
    this.app.listen(port, () => {
      console.log(`Server avviato su http://localhost:${port}`);
    });
  }
}

export default App;