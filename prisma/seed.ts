/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, UserRole } from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de producción...')

  const existing = await prisma.user.findUnique({
    where: { email: 'vazpeitiah@gmail.com' },
  })

  if (existing) {
    console.log('⚠️  El usuario admin ya existe, omitiendo creación.')
    return
  }

  const hashedPassword = await bcrypt.hash('Mvn32@E5Sxm9', 10)

  await prisma.user.create({
    data: {
      name: 'Vladimir Azpeitia',
      email: 'vazpeitiah@gmail.com',
      role: UserRole.ADMIN,
      password: hashedPassword,
    },
  })

  console.log('✅ Usuario admin creado: vazpeitiah@gmail.com')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error durante el seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
