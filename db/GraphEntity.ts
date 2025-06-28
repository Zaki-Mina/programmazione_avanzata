import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./sequelize";

interface GraphAttributes {
  id: number;
  stato: string;
  data: object;
}

interface GraphCreationAttributes extends Optional<GraphAttributes, "id" | "stato"> {}

class GraphEntity extends Model<GraphAttributes, GraphCreationAttributes> implements GraphAttributes {
  public id!: number;
  public stato!: string;
  public data!: object;
}

GraphEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    stato: {
      type: DataTypes.STRING,
      defaultValue: "Creato"
    },
    data: {
      type: DataTypes.JSON
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
