import { User } from "@prisma/client";
import prisma from "../../src/config/database";

export const seedProjects = async (users: User[]) => {
  await prisma.project.createMany({
    data: [
      {
        name: "E-Commerce Storefront",
        description:
          "A modern online store with dynamic product filtering, cart functionality, and a smooth user experience optimized for all devices.",
        view: "board",
        slug: "e_commerce_storefront",
        createdById: users[0].id,
      },
      {
        name: "Task Management Dashboard",
        description:
          "A visual productivity tool that allows users to manage tasks through drag-and-drop boards, track progress, and collaborate in real-time.",
        view: "table",
        slug: "task_management_dashboard",
        createdById: users[0].id,
      },
      {
        name: "Blogging Platform",
        description:
          "A content management system where users can create, edit, and manage blog posts with support for rich text formatting and custom URLs.",
        view: "board",
        slug: "blogging_platform",
        createdById: users[1].id,
      },
      {
        name: "Nutrition Product Explorer",
        description:
          "An interactive product catalog focused on sports nutrition, featuring advanced filtering options, featured product carousels, and detailed product views.",
        view: "table",
        slug: "nutrition_product_explorer",
        createdById: users[1].id,
      },
    ],
  });
  const projects = await prisma.project.findMany();
  return projects;
};
