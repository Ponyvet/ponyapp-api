/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import {
  PrismaClient,
  Species,
  Sex,
  UserRole,
  RecordType,
  MedicationCategory,
  InventoryCategory,
} from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes en orden correcto
  await prisma.inventoryItem.deleteMany()
  await prisma.vaccination.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.visit.deleteMany()
  await prisma.pet.deleteMany()
  await prisma.animalGroup.deleteMany()
  await prisma.medicalRecord.deleteMany()
  await prisma.medication.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  console.log('🗑️  Datos existentes eliminados')

  // Crear usuarios (veterinarios y administradores)
  const hashedPassword = await bcrypt.hash('password123', 10)

  await prisma.user.create({
    data: {
      name: 'Vladimir Azpeitia Hernandez',
      email: 'vladimir@ponyvet.com',
      role: UserRole.ADMIN,
      password: hashedPassword,
    },
  })

  const vet1 = await prisma.user.create({
    data: {
      name: 'Dr. Carlos Rodríguez',
      email: 'carlos@ponyvet.com',
      role: UserRole.VETERINARIAN,
      password: hashedPassword,
    },
  })

  const vet2 = await prisma.user.create({
    data: {
      name: 'Dra. Ana López',
      email: 'ana@ponyvet.com',
      role: UserRole.VETERINARIAN,
      password: hashedPassword,
    },
  })

  console.log('👥 Usuarios creados')

  // Crear medicamentos/vacunas
  const medications = await Promise.all([
    prisma.medication.create({
      data: {
        name: 'Vacuna Antirrábica',
        category: MedicationCategory.VACCINE,
        species: Species.DOG,
        defaultIntervalDays: 365,
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Triple Felina',
        category: MedicationCategory.VACCINE,
        species: Species.CAT,
        defaultIntervalDays: 365,
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Pentavalente',
        category: MedicationCategory.VACCINE,
        species: Species.DOG,
        defaultIntervalDays: 365,
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Amoxicilina',
        category: MedicationCategory.ANTIBIOTIC,
        notes: 'Antibiótico de amplio espectro',
      },
    }),
    prisma.medication.create({
      data: {
        name: 'Ibuprofeno Veterinario',
        category: MedicationCategory.OTHER,
        notes: 'Antiinflamatorio para uso veterinario',
      },
    }),
  ])

  console.log('💊 Medicamentos creados')

  // Crear artículos de inventario
  await Promise.all([
    prisma.inventoryItem.create({
      data: {
        name: 'Vacuna Antirrábica',
        category: InventoryCategory.MEDICATION,
        unit: 'dosis',
        quantity: 50,
        expirationDate: new Date('2024-12-31'),
        medicationId: medications[0].id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Jeringas 5ml',
        category: InventoryCategory.MATERIAL,
        unit: 'pz',
        quantity: 200,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Guantes látex',
        category: InventoryCategory.MATERIAL,
        unit: 'caja',
        quantity: 15,
      },
    }),
  ])

  console.log('📦 Inventario creado')

  // Arrays de datos para generar clientes aleatorios
  const firstNames = [
    'Juan',
    'María',
    'Pedro',
    'Laura',
    'Roberto',
    'Ana',
    'Carlos',
    'Carmen',
    'José',
    'Isabel',
    'Manuel',
    'Pilar',
    'Francisco',
    'Dolores',
    'Antonio',
    'Mercedes',
    'Ángel',
    'Rosa',
    'Luis',
    'Josefa',
    'Jesús',
    'Teresa',
    'Miguel',
    'Esperanza',
    'Rafael',
    'Encarnación',
    'David',
    'Cristina',
    'Daniel',
    'Patricia',
    'Alejandro',
    'Beatriz',
    'Sergio',
    'Mónica',
  ]

  const lastNames = [
    'García',
    'González',
    'Rodríguez',
    'Fernández',
    'López',
    'Martínez',
    'Sánchez',
    'Pérez',
    'Gómez',
    'Martín',
    'Jiménez',
    'Ruiz',
    'Hernández',
    'Díaz',
    'Moreno',
    'Álvarez',
    'Muñoz',
    'Romero',
    'Alonso',
    'Gutiérrez',
  ]

  const cities = [
    { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
    { name: 'Barcelona', lat: 41.3851, lng: 2.1734 },
    { name: 'Valencia', lat: 39.4699, lng: -0.3763 },
    { name: 'Sevilla', lat: 37.3891, lng: -5.9845 },
    { name: 'Zaragoza', lat: 41.6488, lng: -0.8891 },
    { name: 'Málaga', lat: 36.7213, lng: -4.4217 },
  ]
  const streets = [
    'Calle Mayor',
    'Av. de la Constitución',
    'Plaza España',
    'Calle Real',
  ]
  const testPhones = ['7721432826', '7721541841', '7721532960', '7721041190']

  // Crear clientes
  const clients = []
  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 200) + 1
    const phone = testPhones[Math.floor(Math.random() * testPhones.length)]

    // Generar coordenadas aleatorias cerca de la ciudad seleccionada
    // Variación de ±0.05 grados (aproximadamente ±5.5 km)
    const latVariation = (Math.random() - 0.5) * 0.1 // -0.05 a +0.05
    const lngVariation = (Math.random() - 0.5) * 0.1 // -0.05 a +0.05

    const client = await prisma.client.create({
      data: {
        name: `${firstName} ${lastName}`,
        phone,
        address: `${street} ${number}, ${city.name}`,
        latitude: city.lat + latVariation,
        longitude: city.lng + lngVariation,
        notes: Math.random() > 0.5 ? 'Cliente regular' : null,
      },
    })
    clients.push(client)
  }

  console.log('👤 Clientes creados')

  // Crear algunos clientes con cuentas de usuario
  const _clientUser = await prisma.user.create({
    data: {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      role: UserRole.CLIENT,
      password: hashedPassword,
      clientId: clients[0].id,
    },
  })

  console.log('👤 Usuario cliente creado')

  // Arrays para mascotas
  const petNames = [
    'Luna',
    'Max',
    'Bella',
    'Rocky',
    'Coco',
    'Simba',
    'Mimi',
    'Felix',
  ]
  const dogBreeds = [
    'Labrador',
    'Pastor Alemán',
    'Golden Retriever',
    'Bulldog',
    'Mestizo',
  ]
  const catBreeds = [
    'Siamés',
    'Persa',
    'Común Europeo',
    'Maine Coon',
    'Mestizo',
  ]
  const colors = ['Negro', 'Blanco', 'Marrón', 'Dorado', 'Gris', 'Atigrado']

  // Crear cartillas médicas (MedicalRecords) y mascotas
  const medicalRecords = []

  // Crear cartillas individuales para mascotas
  for (const client of clients) {
    const numPets = Math.floor(Math.random() * 3) + 1 // 1-3 mascotas por cliente

    for (let i = 0; i < numPets; i++) {
      const petName = petNames[Math.floor(Math.random() * petNames.length)]
      const species = Math.random() > 0.6 ? Species.DOG : Species.CAT

      // Crear cartilla médica
      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          type: RecordType.PET,
          name: petName,
          notes: `Cartilla médica de ${petName}`,
          clientId: client.id,
        },
      })

      // Crear mascota asociada a la cartilla
      await prisma.pet.create({
        data: {
          species,
          sex: Math.random() > 0.5 ? Sex.MALE : Sex.FEMALE,
          breed:
            species === Species.DOG
              ? dogBreeds[Math.floor(Math.random() * dogBreeds.length)]
              : catBreeds[Math.floor(Math.random() * catBreeds.length)],
          birthDate: new Date(
            2020 + Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1,
          ),
          color: colors[Math.floor(Math.random() * colors.length)],
          notes: Math.random() > 0.7 ? 'Mascota muy juguetona' : null,
          recordId: medicalRecord.id,
        },
      })

      medicalRecords.push(medicalRecord)
    }
  }

  // Crear algunas cartillas de grupo (AnimalGroup)
  for (let i = 0; i < 3; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)]
    const animalTypes = ['Bovino', 'Porcino', 'Ovino', 'Caprino']
    const animalType =
      animalTypes[Math.floor(Math.random() * animalTypes.length)]

    const medicalRecord = await prisma.medicalRecord.create({
      data: {
        type: RecordType.GROUP,
        name: `Grupo ${animalType} - ${client.name}`,
        notes: `Cartilla grupal para ${animalType.toLowerCase()}s`,
        clientId: client.id,
      },
    })

    await prisma.animalGroup.create({
      data: {
        animalType,
        quantity: Math.floor(Math.random() * 50) + 10, // 10-60 animales
        notes: `Grupo de ${animalType.toLowerCase()}s`,
        recordId: medicalRecord.id,
      },
    })

    medicalRecords.push(medicalRecord)
  }

  console.log('📘 Cartillas médicas y mascotas/grupos creados')

  // Crear visitas y consultas
  const currentDate = new Date()
  const visits = []

  for (let i = 0; i < 30; i++) {
    const record =
      medicalRecords[Math.floor(Math.random() * medicalRecords.length)]
    const veterinarian = Math.random() > 0.5 ? vet1 : vet2

    // Obtener el cliente de la cartilla
    const medicalRecord = await prisma.medicalRecord.findUnique({
      where: { id: record.id },
      select: { clientId: true },
    })

    if (!medicalRecord) continue

    // Fecha aleatoria en los últimos 60 días
    const visitDate = new Date(
      currentDate.getTime() - Math.random() * 60 * 24 * 60 * 60 * 1000,
    )

    // Crear visita
    const visit = await prisma.visit.create({
      data: {
        date: visitDate,
        generalNotes: Math.random() > 0.7 ? 'Visita de rutina' : null,
        clientId: medicalRecord.clientId,
        veterinarianId: veterinarian.id,
      },
    })

    visits.push(visit)

    // Crear consulta asociada a la visita
    await prisma.consultation.create({
      data: {
        reason: 'Consulta de rutina',
        diagnosis:
          Math.random() > 0.5
            ? 'Estado de salud normal'
            : 'Requiere seguimiento',
        treatment: Math.random() > 0.5 ? 'Tratamiento preventivo' : null,
        notes: Math.random() > 0.7 ? 'Mascota muy colaboradora' : null,
        visitId: visit.id,
        recordId: record.id,
      },
    })
  }

  console.log('📅 Visitas creadas')
  console.log('🩺 Consultas creadas')

  // Crear vacunaciones
  for (const record of medicalRecords) {
    // Solo crear vacunaciones para algunas cartillas
    if (Math.random() > 0.3) {
      const medication =
        medications[Math.floor(Math.random() * medications.length)]
      const veterinarian = Math.random() > 0.5 ? vet1 : vet2

      const vaccinationDate = new Date(
        currentDate.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000,
      )
      const nextDueDate = medication.defaultIntervalDays
        ? new Date(
            vaccinationDate.getTime() +
              medication.defaultIntervalDays * 24 * 60 * 60 * 1000,
          )
        : null

      await prisma.vaccination.create({
        data: {
          appliedAt: vaccinationDate,
          nextDueDate,
          medicationId: medication.id,
          recordId: record.id,
          consultationId: null, // Vacunación sin consulta
          veterinarianId: veterinarian.id,
        },
      })
    }
  }

  console.log('💉 Vacunaciones creadas')

  // Mostrar resumen
  const summary = {
    usuarios: await prisma.user.count(),
    clientes: await prisma.client.count(),
    cartillas: await prisma.medicalRecord.count(),
    mascotas: await prisma.pet.count(),
    grupos: await prisma.animalGroup.count(),
    medicamentos: await prisma.medication.count(),
    visitas: await prisma.visit.count(),
    consultas: await prisma.consultation.count(),
    vacunaciones: await prisma.vaccination.count(),
    inventario: await prisma.inventoryItem.count(),
  }

  console.log('📊 Resumen de datos creados:')
  console.table(summary)

  console.log('✅ Seed completado exitosamente!')
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
