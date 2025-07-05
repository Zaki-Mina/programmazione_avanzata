import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./sequelize";

interface GraphAttributes {
  id: number;
  stato: string;
  data: object;
  costo: number;
  nome: string;
}

// tipi opzionali
interface GraphCreationAttributes extends Optional<GraphAttributes, "id" | "stato" | "costo" |"nome"> {}
class GraphEntity extends Model<GraphAttributes, GraphCreationAttributes> implements GraphAttributes {
  public id!: number;
  public stato!: string;
  public data!: object;
  public costo!: number;
  public nome!: string;
}

GraphEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
    stato: {
      type: DataTypes.STRING,
      defaultValue: "Creato"
    },
    data: {
      type: DataTypes.JSON
    },
    costo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    }
  },
  {
    sequelize,
    modelName: "Graph",
    tableName: "Graphs",
    timestamps: true
  }
);


export default GraphEntity;
