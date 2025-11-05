import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // If you want to use Microsoft Entra ID, you'd need to implement custom auth strategy
    // For now, this is standard Payload auth
    tokenExpiration: 7200, // 2 hours
  },
  admin: {
    useAsTitle: 'displayName',
    defaultColumns: ['displayName', 'email', 'role', 'department'],
  },
  access: {
    read: ({ req: { user } }) => !!user,
    create: ({
      req: { user },
    }: {
      req: {
        user: {
          role: string
        }
      }
    }) => user?.role === 'admin',
    update: ({
      req: { user },
    }: {
      req: {
        user: {
          role: string
        }
      }
    }) => user?.role === 'admin',
    delete: ({
      req: { user },
    }: {
      req: {
        user: {
          role: string
        }
      }
    }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'aadObjectId',
      type: 'text',
      unique: true,
      required: true,
      label: 'Azure AD Object ID',
      admin: {
        description: 'Microsoft Entra ID (Azure AD) object id',
      },
    },
    {
      name: 'email',
      type: 'email',
      unique: true,
      required: true,
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Display Name',
    },
    {
      name: 'givenName',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'surname',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
    },
    {
      name: 'department',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
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
          label: 'Admin',
          value: 'admin',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
    },
    // {
    //   name: 'lastLoginAt',
    //   type: 'date',
    //   label: 'Last Login',
    //   admin: {
    //     date: {
    //       pickerAppearance: 'dayAndTime',
    //     },
    //   },
    // },
  ],
  timestamps: true, // Adds createdAt and updatedAt automatically
}
