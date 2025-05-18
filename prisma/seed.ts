import { User } from "../src/types/user";
import { seedUsers } from "./seeders/users";
import { seedProjects } from "./seeders/projects";
import { seedStatuses } from "./seeders/statuses";
import prisma from "../src/config/database";
import { seedTasks } from "./seeders/tasks";

async function main() {
  const statuses = await seedStatuses();
  console.log("Statuses seeded successfully");
  const users = await seedUsers();
  console.log("Users seeded successfully");
  const projects = await seedProjects(users);
  console.log("Projects seeded successfully");
  await seedTasks(users, projects, statuses);
  console.log("Tasks seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
