import { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    defaultColumns: ['content', 'activity', 'author', 'createdAt'],
    group: 'Project Management',
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user }, id }) => {
      // Users can only update their own comments
      return {
        author: {
          equals: user?.id,
        },
      }
    },
    delete: ({ req: { user } }) => ['admin', 'policy_staff'].includes(user?.role),
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment',
    },
    {
      name: 'activity',
      type: 'relationship',
      relationTo: 'activities',
      label: 'Related Activity',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      admin: { position: 'sidebar' },
      options: [
        {
          label: 'Staff',
          value: 'staff',
        },
        {
          label: 'Policy Staff',
          value: 'policy_staff',
        },
        {
          label: 'Minister',
          value: 'minister',
        },
        {
          label: 'Activity',
          value: 'activity',
        },
      ],
    },
    { name: 'files', type: 'upload', relationTo: 'media', hasMany: true },
  ],
  timestamps: true,
}
