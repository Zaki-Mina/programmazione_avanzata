import path from "path";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.resolve(__dirname, "../database.sqlite"), 
  logging: false,
});

export default sequelize;
