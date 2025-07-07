import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sequelize";

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public role!: "admin" | "user";
  public tokens!: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    tokens: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users", 
  }
);

export default User;
