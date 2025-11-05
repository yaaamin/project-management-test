import { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['code', 'name', 'status', 'priority', 'owner'],
    group: 'Project Management',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => ['admin', 'policy_staff'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'policy_staff'].includes(user?.role),
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'code',
      type: 'text',
      unique: true,
      label: 'Project Code',
      admin: {
        description: 'Unique project identifier (e.g., PRJ-001)',
      },
    },
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planned',
      options: [
        {
          label: 'Planned',
          value: 'planned',
        },
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'On Hold',
          value: 'on_hold',
        },
        {
          label: 'Completed',
          value: 'completed',
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
        condition: (data) => ['completed', 'cancelled'].includes(data?.status),
      },
    },
    {
      name: 'budget',
      type: 'number',
      min: 0,
      admin: {
        step: 0.01,
        description: 'Budget in USD',
      },
    },
    {
      name: 'parentProject',
      type: 'relationship',
      relationTo: 'projects',
      label: 'Parent Project',
      admin: {
        description: 'If this is a sub-project, select the parent project',
        position: 'sidebar',
      },
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
