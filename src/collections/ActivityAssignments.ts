import { CollectionConfig } from 'payload'

export const ActivityAssignments: CollectionConfig = {
  slug: 'activity-assignments',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['activity', 'user', 'role'],
    group: 'Project Management',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'activity',
      type: 'relationship',
      relationTo: 'activities',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Role/Responsibility',
      admin: {
        description: 'e.g., Lead, Contributor, Reviewer',
      },
    },
  ],
  timestamps: true,
}
