import { DataTypes } from "sequelize";
import sequelize from "../db/sequelize";

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  tokens: { type: DataTypes.FLOAT, defaultValue: 0 }
});

export default User;
