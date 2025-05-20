export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  position?: string;
  username?: string;
  role?: string | null;
  team?: string;
  location?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
};
