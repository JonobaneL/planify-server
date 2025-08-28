import prisma from "../../src/config/database";
export const seedStatuses = async () => {
  await prisma.status.createMany({
    data: [
      {
        label: "Not Started",
        color: "#797E93",
        type: "status",
        orderIndex: 1,
      },
      {
        label: "In Progress",
        color: "#DEA761",
        type: "status",
        orderIndex: 2,
      },
      {
        label: "In Review",
        color: "#4C18DC",
        type: "status",
        orderIndex: 3,
      },
      {
        label: "In QA",
        color: "#885A95",
        type: "status",
        orderIndex: 4,
      },
      {
        label: "Done",
        color: "#175A63",
        type: "status",
        orderIndex: 5,
      },

      {
        label: "Low",
        color: "#6E9CE2",
        type: "priority",
        orderIndex: 1,
      },
      {
        label: "Medium",
        color: "#777AE5",
        type: "priority",
        orderIndex: 2,
      },
      {
        label: "High",
        color: "#5E429B",
        type: "priority",
        orderIndex: 3,
      },
      {
        label: "Feature",
        color: "#006666",
        type: "type",
        orderIndex: 1,
      },
      {
        label: "Bug",
        color: "#b30000",
        type: "type",
        orderIndex: 2,
      },
      {
        label: "Task",
        color: "#ff9900",
        type: "type",
        orderIndex: 3,
      },
    ],
  });

  const statuses = await prisma.status.findMany();
  return statuses;
};
