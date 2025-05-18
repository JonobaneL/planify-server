import prisma from "../../src/config/database";

import bcrypt from "bcrypt";

export const seedUsers = async () => {
  const hashedPassword1 = await bcrypt.hash("password123", 10);
  const hashedPassword2 = await bcrypt.hash("password123", 10);
  await prisma.user.createMany({
    data: [
      {
        email: "john.doe@example.com",
        first_name: "John",
        last_name: "Doe",
        password: hashedPassword1,
        position: "Developer",
        username: "johndoe",
        role: "admin",
        team: "Engineering",
        location: "New York",
        phone: "123-456-7890",
      },
      {
        email: "jane.smith@example.com",
        first_name: "Jane",
        last_name: "Smith",
        password: hashedPassword2,
        position: "Designer",
        username: "janesmith",
        role: "user",
        team: "Design",
        location: "San Francisco",
        phone: "987-654-3210",
      },
    ],
  });
  const users = await prisma.user.findMany();
  return users;
};
