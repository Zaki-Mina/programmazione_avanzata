import { DataTypes, Model, Optional } from "sequelize";
import SequelizeSingleton from "./sequelize";
const sequelize = SequelizeSingleton.getInstance();

//Definisce la struttura di un oggetto grafo con i tipi TypeScript
interface GraphAttributes {
  id: number;
  stato: string;
  data: object; //Oggetto JSON che conterrà la struttura del grafo
  costo: number;
  nome: string;
  userId: number; 
 
}

// tipi opzionali
interface GraphCreationAttributes extends Optional<GraphAttributes, "id" | "stato" | "costo" |"nome"> {}
class GraphEntity extends Model<GraphAttributes, GraphCreationAttributes> implements GraphAttributes {
  public id!: number;
  public stato!: string;
  public data!: object;
  public costo!: number;
  public nome!: string;
  public userId!: number;
}

GraphEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    stato: {
      type: DataTypes.STRING,
      defaultValue: "Creato",
    },
    data: {
      type: DataTypes.JSON,
    },
    costo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, 
  },
  {
    sequelize,
    modelName: "Graph",
    tableName: "Graphs",
    timestamps: true
  }
);


export default GraphEntity;
