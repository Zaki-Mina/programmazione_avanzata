import SequelizeSingleton from "./sequelize";
const sequelize = SequelizeSingleton.getInstance();
import User from "../models/User";
import GraphEntity from "./GraphEntity";

async function seed() { //per incronizzare il database
  const TOKENS=50
  await sequelize.sync({ force: true });
  console.log("DB ripulito");

  await User.bulkCreate([
    { id: 1, email: "admin@example.com", role: "admin", tokens: TOKENS },
    { id: 2, email: "user1@example.com", role: "user", tokens: TOKENS },
  ]);

  const users = await User.findAll();
  console.log("Utenti inseriti:", users.map(u => u.toJSON()));

  console.log("Seed completo");
  process.exit(0);
}

seed().catch(console.error);