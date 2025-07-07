import sequelize from "./sequelize";
import User from "../models/User";

async function seed() {
  await sequelize.sync({ force: true });
  console.log("DB ripulito");

  await User.bulkCreate([
    { id: 1, email: "admin@example.com", password: "admin123", role: "admin", tokens: 9999 },
    { id: 2, email: "user1@example.com", password: "user123", role: "user", tokens: 5 },
  ]);

  const users = await User.findAll();
  console.log("Utenti inseriti:", users.map(u => u.toJSON()));

  console.log("Seed completo");
  process.exit(0);
}

seed().catch(console.error);
