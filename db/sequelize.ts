import path from "path";
import { Sequelize } from "sequelize";

class SequelizeSingleton {
  private static instance: Sequelize; //Variabile statica che conserva l'unica istanza di Sequelize

  private constructor() {} // Previene creazione diretta

  public static getInstance(): Sequelize { //Accessibile senza istanziare la classe
    if (!SequelizeSingleton.instance) {
      SequelizeSingleton.instance = new Sequelize({ //la creazione di nuove istanze
        dialect: "sqlite",
        storage: path.resolve(__dirname, "../database.sqlite"),
        logging: false,
      });
    }
    return SequelizeSingleton.instance;
  }
}

export default SequelizeSingleton;
