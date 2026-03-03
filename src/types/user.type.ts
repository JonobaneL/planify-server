import { User as PrismaUser } from '@generated/prisma/client';

export type User = Omit<PrismaUser, 'password'>;
