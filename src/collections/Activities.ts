import { CollectionConfig } from 'payload'

export const Activities: CollectionConfig = {
  slug: 'activities',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'status', 'priority', 'project', 'owner'],
    group: 'Project Management',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => ['admin', 'policy_staff'].includes(user?.role),
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'activity',
      options: [
        {
          label: 'Activity',
          value: 'activity',
        },
        {
          label: 'Sub-Activity',
          value: 'sub_activity',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not_started',
      options: [
        {
          label: 'Not Started',
          value: 'not_started',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'Blocked',
          value: 'blocked',
        },
        {
          label: 'Done',
          value: 'done',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'priority',
      type: 'select',
      defaultValue: 'medium',
      options: [
        {
          label: 'Low',
          value: 'low',
        },
        {
          label: 'Medium',
          value: 'medium',
        },
        {
          label: 'High',
          value: 'high',
        },
        {
          label: 'Urgent',
          value: 'urgent',
        },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          label: 'Start Date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'endDate',
          type: 'date',
          label: 'End Date',
          admin: {
            width: '50%',
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'actualEndDate',
      type: 'date',
      label: 'Actual End Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        condition: (data) => ['done', 'cancelled'].includes(data?.status),
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'estimatedHours',
          type: 'number',
          label: 'Estimated Hours',
          min: 0,
          admin: {
            width: '50%',
            step: 0.5,
          },
        },
        {
          name: 'actualHours',
          type: 'number',
          label: 'Actual Hours',
          min: 0,
          admin: {
            width: '50%',
            step: 0.5,
          },
        },
      ],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'parentActivity',
      type: 'relationship',
      relationTo: 'activities',
      label: 'Parent Activity',
      admin: {
        description: 'If this is a sub-activity, select the parent activity',
        position: 'sidebar',
        condition: (data) => data?.type === 'sub_activity',
      },
      filterOptions: ({ data }) => {
        return {
          type: { equals: 'activity' },
          project: { equals: data?.project },
        }
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    { name: 'files', type: 'upload', relationTo: 'media', hasMany: true },
  ],
  timestamps: true,
}
