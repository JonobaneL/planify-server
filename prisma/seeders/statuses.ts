import { prisma } from '../prismaConfig';

export const seedStatuses = async () => {
  await prisma.status.createMany({
    data: [
      {
        label: 'Not Started',
        color: '#797E93',
        type: 'status',
      },
      {
        label: 'In Progress',
        color: '#DEA761',
        type: 'status',
      },
      {
        label: 'In Review',
        color: '#4C18DC',
        type: 'status',
      },
      {
        label: 'In QA',
        color: '#885A95',
        type: 'status',
      },
      {
        label: 'Done',
        color: '#175A63',
        type: 'status',
      },

      {
        label: 'Low',
        color: '#6E9CE2',
        type: 'priority',
      },
      {
        label: 'Medium',
        color: '#777AE5',
        type: 'priority',
      },
      {
        label: 'High',
        color: '#5E429B',
        type: 'priority',
      },
      {
        label: 'Feature',
        color: '#006666',
        type: 'type',
      },
      {
        label: 'Bug',
        color: '#b30000',
        type: 'type',
      },
      {
        label: 'Task',
        color: '#ff9900',
        type: 'type',
      },
    ],
  });

  const statuses = await prisma.status.findMany();
  return statuses;
};
