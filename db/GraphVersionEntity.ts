import { DataTypes, Model, Optional } from "sequelize";
import SequelizeSingleton from "./sequelize";
import GraphEntity from "./GraphEntity";

const sequelize = SequelizeSingleton.getInstance();

export interface GraphVersionAttributes {
  id: number;
  graphId: number;
  struttura: object;
  nNodes: number;
  nEdges: number;
  updatedAt: Date;
}

export interface GraphVersionCreationAttributes
  extends Optional<GraphVersionAttributes, "id" | "updatedAt"> {}

export class GraphVersionEntity
  extends Model<GraphVersionAttributes, GraphVersionCreationAttributes>
  implements GraphVersionAttributes {
  public id!: number;
  public graphId!: number;
  public struttura!: object;
  public nNodes!: number;
  public nEdges!: number;
  public updatedAt!: Date;
}

GraphVersionEntity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    graphId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: GraphEntity,
        key: "id",
      },
    },
    struttura: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    nNodes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nEdges: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "GraphVersion",
    tableName: "graph_versions",
    timestamps: false,
  }
);

GraphVersionEntity.belongsTo(GraphEntity, {
  foreignKey: "graphId",
  as: "graph",
  onDelete: "CASCADE",
});