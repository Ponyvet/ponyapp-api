import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'

import { prisma } from './prisma.js'
import { ac, ADMIN, VETERINARIAN, CLIENT } from './permissions.js'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins: ['http://localhost:5173', 'https://app.ponyvet.com'],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
  },
  user: {
    additionalFields: {
      clientId: {
        type: 'string',
        required: false,
        input: false,
      },
      isActive: {
        type: 'boolean',
        defaultValue: true,
        input: false,
      },
    },
  },
  plugins: [
    admin({
      ac,
      roles: { ADMIN, VETERINARIAN, CLIENT },
      adminRoles: ['ADMIN'],
      defaultRole: 'CLIENT',
    }),
  ],
  advanced: {
    defaultCookieAttributes: {
      sameSite: 'none',
      secure: true,
    },
  },
})
