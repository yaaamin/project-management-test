import { CollectionConfig } from 'payload'
import jwt from 'jsonwebtoken'

export const Users: CollectionConfig = {
  slug: 'users',
  // auth: {
  //   // If you want to use Microsoft Entra ID, you'd need to implement custom auth strategy
  //   // For now, this is standard Payload auth
  //   tokenExpiration: 7200, // 2 hours
  //   useAPIKey: true,
  // },
  auth: true,
  endpoints: [
    {
      path: '/oauth/microsoft',
      method: 'get',
      handler: async (req) => {
        const redirectUri = `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/authorize?client_id=${process.env.AZURE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.AZURE_REDIRECT_URI)}&scope=openid%20profile%20email`

        return Response.redirect(redirectUri)

        console.log(redirectUri)
      },
    },
    {
      path: '/oauth/microsoft/callback',
      method: 'get',
      handler: async (req) => {
        const { code } = req.query

        try {
          const tokenResponse = await fetch(
            `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/oauth2/v2.0/token`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: new URLSearchParams({
                client_id: process.env.AZURE_CLIENT_ID,
                client_secret: process.env.AZURE_CLIENT_SECRET,
                code: code as string,
                redirect_uri: process.env.AZURE_REDIRECT_URI,
                grant_type: 'authorization_code',
              }),
            },
          )

          // console.log(JSON.stringify(tokenResponse, null, 2))

          const tokens = await tokenResponse.json()

          // Get user info
          const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
          })

          type GraphUser = {
            '@odata.context': string
            businessPhones: string[]
            displayName: string
            givenName: string
            jobTitle: string | null
            mail: string | null
            mobilePhone: string | null
            officeLocation: string | null
            preferredLanguage: string | null
            surname: string
            userPrincipalName: string
            id: string
          }

          const userData = (await userResponse.json()) as GraphUser

          // Find or create user in Payload
          let user = await req.payload.find({
            collection: 'users',
            where: { microsoftId: { equals: userData.id } },
          })

          if (user.docs.length === 0) {
            const array = new Uint8Array(32)
            crypto.getRandomValues(array)
            const randomPassword = Array.from(array, (byte) =>
              byte.toString(16).padStart(2, '0'),
            ).join('')

            user = await req.payload.create({
              collection: 'users',
              data: {
                email: userData.mail || userData.userPrincipalName,
                microsoftId: userData.id,
                givenName: userData?.givenName,
                jobTitle: userData?.jobTitle,
                surname: userData?.surname,
                displayName: userData?.displayName,
                role: 'staff',
                aadObjectId: userData?.id,
                password: randomPassword,
              },
            })
          }

          // return Response.json({
          //   userData,
          //   tokens,
          //   user,
          //   id: user?.docs[0]?.id,
          // })

          const token = jwt.sign(
            { id: user?.id ?? user?.docs[0]?.id, msftId: userData?.id },
            process.env.PAYLOAD_SECRET,
            {
              expiresIn: '1d',
            },
          )

          // Redirect to frontend with token
          return Response.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`)
        } catch (error) {
          console.error(error)
        }

        // Exchange code for token
      },
    },
  ],
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
      required: false,
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
      defaultValue: false,
      label: 'Active',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'microsoftId',
      type: 'text',
      unique: true,
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
