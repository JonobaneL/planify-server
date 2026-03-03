import { prisma } from '../prismaConfig';

import { hash } from 'bcrypt';

export const seedUsers = async () => {
  try {
    const hashedPassword1 = await hash('password123', 10);
    const hashedPassword2 = await hash('password123', 10);

    await prisma.user.createMany({
      data: [
        {
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: hashedPassword1,
          position: 'Developer',
          role: 'admin',
          location: 'New York',
          phone: '123-456-7890',
        },
        {
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          password: hashedPassword2,
          position: 'Designer',
          role: 'user',
          location: 'San Francisco',
          phone: '987-654-3210',
        },
      ],
    });
    const users = await prisma.user.findMany();
    return users;
  } catch (error: any) {
    console.error('Error seeding users:', error);
    throw error;
  }
};
