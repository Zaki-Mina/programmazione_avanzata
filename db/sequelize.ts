import path from "path";
import { Sequelize } from "sequelize";

// per Configurare e esportare l'istanza di connessione a Sequelize.
const sequelize = new Sequelize({ //crea una nuova istanza di Sequelize per SQLite
  dialect: "sqlite", 
  storage: path.resolve(__dirname, "../database.sqlite"), //Specifica il path del file database 
  logging: false,
});

export default sequelize;
