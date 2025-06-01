import { Prisma, Project, Status, User } from "@prisma/client";
import prisma from "../../src/config/database";

const mockTasks = [
  // Project 1 Tasks
  {
    title: "Develop user authentication system",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "feature",
    assigned_user: "johndoe",
    status: "Not Started",
    slug: "tsk-1",
    dueDate: "2025-10-15T00:00:00.000Z",
    createdBy: "johndoe",
  },
  {
    title: "Fix login page crash on invalid input",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "bug",
    assigned_user: "johndoe",
    status: "In Progress",
    priority: "Medium",
    slug: "tsk-2",
    dueDate: "2025-10-10T00:00:00.000Z",
    createdBy: "johndoe",
  },
  {
    title: "Update project documentation",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "task",
    assigned_user: "janesmith",
    status: "In Review",
    estimation: 2,
    slug: "tsk-3",
    createdBy: "janesmith",
  },
  {
    title: "Implement payment gateway integration",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "feature",
    assigned_user: "janesmith",
    status: "In QA",
    priority: "Low",
    slug: "tsk-4",
    dueDate: "2025-10-20T00:00:00.000Z",
    createdBy: "janesmith",
  },
  {
    title: "Resolve database connection timeout",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "bug",
    assigned_user: "janesmith",
    status: "Done",
    slug: "tsk-5",
    createdBy: "janesmith",
  },
  {
    title: "Create API documentation",
    description: "Placeholder description for task",
    project: "e_commerce_storefront",
    type: "task",
    assigned_user: "janesmith",
    status: "Not Started",
    slug: "tsk-6",
    dueDate: "2025-10-18T00:00:00.000Z",
    createdBy: "janesmith",
  },

  // Project 2 Tasks
  {
    title: "Design dashboard UI",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "feature",
    assigned_user: "janesmith",
    status: "Not Started",
    slug: "tsk-7",
    dueDate: "2025-10-18T00:00:00.000Z",
    createdBy: "janesmith",
  },
  {
    title: "Fix broken links in footer",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "bug",
    assigned_user: "janesmith",
    status: "In Progress",
    priority: "Medium",
    slug: "tsk-8",
    dueDate: "2025-10-12T00:00:00.000Z",
    createdBy: "janesmith",
  },
  {
    id: "tsk-9",
    title: "Schedule team sprint planning",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "task",
    assigned_user: "janesmith",
    status: "In Review",
    slug: "tsk-9",
    createdBy: "janesmith",
  },
  {
    title: "Add notification system",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "feature",
    assigned_user: "johndoe",
    status: "In QA",
    priority: "Low",
    slug: "tsk-10",
    dueDate: "2025-10-22T00:00:00.000Z",
    createdBy: "johndoe",
  },
  {
    title: "Correct UI alignment issues",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "bug",
    assigned_user: "johndoe",
    status: "Done",
    slug: "tsk-11",
    createdBy: "johndoe",
  },
  {
    title: "Optimize database queries",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "task",
    assigned_user: "johndoe",
    status: "Not Started",
    priority: null,
    estimation: 4,
    slug: "tsk-12",
    dueDate: "2025-10-25T00:00:00.000Z",
    createdBy: "johndoe",
  },
  {
    title: "Integrate analytics tracking",
    description: "Placeholder description for task",
    project: "task_management_dashboard",
    type: "feature",
    assigned_user: "johndoe",
    status: "In Progress",
    slug: "tsk-13",
    dueDate: "2025-10-20T00:00:00.000Z",
    createdBy: "johndoe",
  },
];

export const seedTasks = async (
  users: User[],
  projects: Project[],
  statuses: Status[]
) => {
  const promises = mockTasks.map(async (task) => {
    const user = users.find((user) => user.username === task.createdBy);
    const project = projects.find((project) => project.slug === task.project);
    const priority = statuses.find((status) => status.label === task.priority);
    const status =
      task.status && statuses.find((status) => status.label === task.status);

    if (!user || !project || !status) {
      throw new Error("Invalid task data");
    }
    const data: Prisma.TaskCreateInput = {
      title: task.title,
      description: task.description,
      type: task.type,
      status: { connect: { id: status.id } },
      assignedUser: {
        connect: {
          id: user.id,
        },
      },
      project: {
        connect: {
          id: project.id,
        },
      },
      createdBy: {
        connect: {
          id: user.id,
        },
      },
      slug: task.slug,
      updatedBy: {
        connect: {
          id: user.id,
        },
      },
    };
    if (priority) {
      data.priority = { connect: { id: priority.id } };
    }
    if (task.dueDate) {
      data.dueDate = new Date(task.dueDate);
    }
    return prisma.task.create({ data });
  });

  await Promise.all(promises);
};
