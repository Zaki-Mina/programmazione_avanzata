import { DataTypes, Model, Optional } from "sequelize";
import SequelizeSingleton from "../db/sequelize";
const sequelize = SequelizeSingleton.getInstance();

export type UserRole = "admin" | "user";

interface UserAttributes {
  id: number;
  email: string;
  role: UserRole;
  tokens: number;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "tokens"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public role!: UserRole;
  public tokens!: number;
  
  // Modifica questa dichiarazione per evitare dipendenze circolari
  public readonly graphs?: import("../db/GraphEntity").default[];
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
    role: { type: DataTypes.ENUM("admin", "user"), allowNull: false, defaultValue: "user" },
    tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "Users",
  }
);

export default User;