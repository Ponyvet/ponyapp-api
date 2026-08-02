import { createAccessControl } from 'better-auth/plugins/access'
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access'

const statement = {
  ...defaultStatements,
} as const

export const ac = createAccessControl(statement)

export const ADMIN = ac.newRole({
  ...adminAc.statements,
})

export const VETERINARIAN = ac.newRole({
  user: [],
  session: [],
})

export const CLIENT = ac.newRole({
  user: [],
  session: [],
})
