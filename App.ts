import express, { Application } from "express";
import BaseController from "./controllers/BaseController";

class App {
  public app: Application;

  constructor(controllers: BaseController[]) {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: BaseController[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router); // Assicura che BaseController abbia `router`
    });
  }

  public listen() {
    const port = process.env.PORT || 3000;
    this.app.listen(port, () => {
      console.log(` Server avviato su http://localhost:${port}`);
    });
  }
}

export default App;
