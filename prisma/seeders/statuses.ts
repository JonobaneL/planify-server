import prisma from "../../src/config/database";
export const seedStatuses = async () => {
  await prisma.status.createMany({
    data: [
      {
        label: "Not Started",
        color: "#797E93",
        orderIndex: 1,
      },
      {
        label: "In Progress",
        color: "#DEA761",
        orderIndex: 2,
      },
      {
        label: "In Review",
        color: "#4C18DC",
        orderIndex: 3,
      },
      {
        label: "In QA",
        color: "#885A95",
        orderIndex: 4,
      },
      {
        label: "Done",
        color: "#175A63",
        orderIndex: 5,
      },

      {
        label: "Low",
        color: "#6E9CE2",
        orderIndex: 1,
      },
      {
        label: "Medium",
        color: "#777AE5",
        orderIndex: 2,
      },
      {
        label: "High",
        color: "#5E429B",
        orderIndex: 3,
      },
    ],
  });

  const statuses = await prisma.status.findMany();
  return statuses;
};
