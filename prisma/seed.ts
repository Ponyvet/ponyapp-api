/* eslint-disable no-console */
import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import {
  PrismaClient,
  Species,
  Sex,
  VaccinationStatus,
  UserRole,
} from '../src/generated/prisma/client'
import bcrypt from 'bcrypt'

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.reminder.deleteMany()
  await prisma.vaccination.deleteMany()
  await prisma.vaccine.deleteMany()
  await prisma.pet.deleteMany()
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

  // Crear vacunas
  const vaccines = await Promise.all([
    prisma.vaccine.create({
      data: {
        name: 'Rabia',
        species: Species.DOG,
        type: 'Obligatoria',
        intervalDays: 365,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Triple Felina',
        species: Species.CAT,
        type: 'Básica',
        intervalDays: 365,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Pentavalente',
        species: Species.DOG,
        type: 'Básica',
        intervalDays: 365,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Leucemia Felina',
        species: Species.CAT,
        type: 'Opcional',
        intervalDays: 365,
      },
    }),
    prisma.vaccine.create({
      data: {
        name: 'Parvovirus',
        species: Species.DOG,
        type: 'Básica',
        intervalDays: 365,
      },
    }),
  ])

  console.log('💉 Vacunas creadas')

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
    'José Antonio',
    'Ángeles',
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
    'Pablo',
    'Sandra',
    'Adrián',
    'Raquel',
    'Eduardo',
    'Silvia',
    'Fernando',
    'Nuria',
    'Jorge',
    'Eva',
    'Rubén',
    'Marta',
    'Álvaro',
    'Lucía',
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
    'Navarro',
    'Torres',
    'Domínguez',
    'Vázquez',
    'Ramos',
    'Gil',
    'Ramírez',
    'Serrano',
    'Blanco',
    'Suárez',
    'Molina',
    'Morales',
    'Ortega',
    'Delgado',
    'Castro',
    'Ortiz',
    'Rubio',
    'Marín',
    'Sanz',
    'Iglesias',
    'Medina',
    'Garrido',
    'Cortés',
    'Castillo',
    'Santos',
    'Lozano',
    'Guerrero',
    'Cano',
    'Prieto',
    'Méndez',
  ]

  const cities = [
    'Madrid',
    'Barcelona',
    'Valencia',
    'Sevilla',
    'Zaragoza',
    'Málaga',
    'Murcia',
    'Palma',
    'Las Palmas',
    'Bilbao',
    'Alicante',
    'Córdoba',
    'Valladolid',
    'Vigo',
    'Gijón',
    'Hospitalet',
    'Coruña',
    'Granada',
    'Vitoria',
    'Elche',
    'Oviedo',
    'Badalona',
    'Cartagena',
    'Terrassa',
    'Jerez',
    'Sabadell',
    'Móstoles',
    'Santa Cruz',
    'Pamplona',
    'Almería',
    'Alcalá',
    'Fuenlabrada',
    'Leganés',
  ]

  const streets = [
    'Calle Mayor',
    'Av. de la Constitución',
    'Plaza España',
    'Calle Real',
    'Paseo del Prado',
    'Calle de la Paz',
    'Av. de Andalucía',
    'Calle Luna',
    'Plaza del Sol',
    'Calle Nueva',
    'Av. de la Libertad',
    'Calle San José',
    'Plaza Mayor',
    'Calle Victoria',
    'Paseo Marítimo',
    'Calle Cervantes',
    'Av. de Europa',
    'Calle Goya',
    'Plaza de la Iglesia',
    'Calle Alameda',
  ]

  // Números de teléfono para pruebas
  const testPhones = ['7721432826', '7721541841', '7721532960', '7721041190']

  // Crear 100 clientes
  const clientsData = []
  for (let i = 0; i < 100; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    const city = cities[Math.floor(Math.random() * cities.length)]
    const street = streets[Math.floor(Math.random() * streets.length)]
    const number = Math.floor(Math.random() * 200) + 1
    const phone = testPhones[Math.floor(Math.random() * testPhones.length)]

    const possibleNotes = [
      null,
      'Cliente preferente',
      'Muy puntual en las citas',
      'Tiene varios animales',
      'Prefiere citas por la mañana',
      'Prefiere citas por la tarde',
      'Cliente nuevo',
      'Muy colaborador',
      'Necesita recordatorios',
    ]

    clientsData.push({
      name: `${firstName} ${lastName}`,
      phone,
      address: `${street} ${number}, ${city}`,
      notes: possibleNotes[Math.floor(Math.random() * possibleNotes.length)],
    })
  }

  // Crear clientes en lotes para mejor rendimiento
  const clients = []
  const batchSize = 20
  for (let i = 0; i < clientsData.length; i += batchSize) {
    const batch = clientsData.slice(i, i + batchSize)
    const createdClients = await Promise.all(
      batch.map((clientData) =>
        prisma.client.create({
          data: clientData,
        }),
      ),
    )
    clients.push(...createdClients)
  }

  console.log('👤 Clientes creados')

  // Arrays de datos para generar mascotas aleatorias
  const dogNames = [
    'Luna',
    'Max',
    'Bella',
    'Rocky',
    'Rex',
    'Coco',
    'Toby',
    'Buddy',
    'Charlie',
    'Milo',
    'Zeus',
    'Bruno',
    'Duke',
    'Oscar',
    'Leo',
    'Jack',
    'Simba',
    'Thor',
    'Cooper',
    'Buster',
    'Diesel',
    'Tucker',
    'Murphy',
    'Bear',
    'Gus',
    'Finn',
    'Ollie',
    'Louie',
    'Blue',
    'Gunner',
    'Ace',
    'Scout',
    'Bandit',
    'Ranger',
    'Rocco',
    'Cash',
    'Bentley',
    'Hank',
    'Kobe',
    'Chester',
  ]

  const catNames = [
    'Mimi',
    'Garfield',
    'Nala',
    'Simba',
    'Salem',
    'Shadow',
    'Smokey',
    'Tigger',
    'Felix',
    'Mittens',
    'Oreo',
    'Whiskers',
    'Boots',
    'Patches',
    'Socks',
    'Tiger',
    'Pumpkin',
    'Ginger',
    'Snowball',
    'Princess',
    'Angel',
    'Precious',
    'Misty',
    'Lucky',
    'Jasper',
    'Oscar',
    'Muffin',
    'Chloe',
    'Sophie',
    'Lily',
    'Molly',
    'Gracie',
    'Maggie',
    'Lucy',
    'Zoe',
    'Stella',
    'Lola',
    'Cleo',
    'Mia',
    'Bella',
  ]

  const dogBreeds = [
    'Labrador',
    'Pastor Alemán',
    'Golden Retriever',
    'Bulldog Francés',
    'Rottweiler',
    'Chihuahua',
    'Yorkshire Terrier',
    'Poodle',
    'Beagle',
    'Boxer',
    'Border Collie',
    'Cocker Spaniel',
    'Dálmata',
    'Husky Siberiano',
    'Mastín',
    'Schnauzer',
    'Bull Terrier',
    'Shih Tzu',
    'Jack Russell',
    'Pointer',
    'Setter',
    'Galgo',
    'Mestizo',
    'Pitbull',
    'Doberman',
    'Basset Hound',
    'Weimaraner',
  ]

  const catBreeds = [
    'Siamés',
    'Persa',
    'Maine Coon',
    'Común Europeo',
    'Británico de Pelo Corto',
    'Ragdoll',
    'Bengalí',
    'Abisinio',
    'Russian Blue',
    'Sphynx',
    'Scottish Fold',
    'Birmano',
    'Noruego',
    'Oriental',
    'Burmés',
    'Angora',
    'Savannah',
    'Mestizo',
  ]

  const colors = [
    'Negro',
    'Blanco',
    'Marrón',
    'Dorado',
    'Gris',
    'Atigrado',
    'Tricolor',
    'Negro y blanco',
    'Marrón y blanco',
    'Negro y marrón',
    'Gris y blanco',
    'Dorado claro',
    'Chocolate',
    'Crema',
    'Naranja',
    'Plateado',
    'Canela',
  ]

  // Crear entre 200-300 mascotas (1-4 por cliente)
  const petsData = []

  for (const client of clients) {
    const numPets = Math.floor(Math.random() * 4) + 1 // 1-4 mascotas por cliente

    for (let i = 0; i < numPets; i++) {
      const species = Math.random() > 0.6 ? Species.DOG : Species.CAT // 60% perros, 40% gatos
      const names = species === Species.DOG ? dogNames : catNames
      const breeds = species === Species.DOG ? dogBreeds : catBreeds

      const name = names[Math.floor(Math.random() * names.length)]
      const breed = breeds[Math.floor(Math.random() * breeds.length)]
      const sex = Math.random() > 0.5 ? Sex.MALE : Sex.FEMALE
      const color = colors[Math.floor(Math.random() * colors.length)]

      // Fechas de nacimiento entre 2020 y 2024
      const startDate = new Date('2020-01-01').getTime()
      const endDate = new Date('2024-12-31').getTime()
      const randomTime = startDate + Math.random() * (endDate - startDate)
      const birthDate = new Date(randomTime)

      const possibleNotes = [
        null,
        null,
        null, // Más probabilidad de null
        'Muy juguetón',
        'Tímido con extraños',
        'Le gusta el agua',
        'Muy activo',
        'Tranquilo y obediente',
        'Necesita medicación especial',
        'Alérgico a algunos alimentos',
      ]

      petsData.push({
        name,
        species,
        breed,
        sex,
        birthDate,
        color,
        notes: possibleNotes[Math.floor(Math.random() * possibleNotes.length)],
        clientId: client.id,
      })
    }
  }

  // Crear mascotas en lotes
  const pets = []
  for (let i = 0; i < petsData.length; i += batchSize) {
    const batch = petsData.slice(i, i + batchSize)
    const createdPets = await Promise.all(
      batch.map((petData) =>
        prisma.pet.create({
          data: petData,
        }),
      ),
    )
    pets.push(...createdPets)
  }

  console.log('🐕🐱 Mascotas creadas')

  // Crear vacunaciones
  const currentDate = new Date()
  const oneMonthAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)
  const twoMonthsAgo = new Date(
    currentDate.getTime() - 60 * 24 * 60 * 60 * 1000,
  )
  const oneMonthLater = new Date(
    currentDate.getTime() + 30 * 24 * 60 * 60 * 1000,
  )
  const twoMonthsLater = new Date(
    currentDate.getTime() + 60 * 24 * 60 * 60 * 1000,
  )
  const oneYearLater = new Date(
    currentDate.getTime() + 365 * 24 * 60 * 60 * 1000,
  )

  const vaccinations = []

  // Vacunaciones para perros
  const dogPets = pets.filter((pet) => pet.species === Species.DOG)
  const dogVaccines = vaccines.filter(
    (vaccine) => vaccine.species === Species.DOG,
  )

  for (const pet of dogPets) {
    for (const vaccine of dogVaccines) {
      const isApplied = Math.random() > 0.3 // 70% aplicadas

      const vaccination = await prisma.vaccination.create({
        data: {
          appliedAt: isApplied ? oneMonthAgo : null,
          nextDueDate: isApplied ? oneYearLater : oneMonthLater,
          status: isApplied
            ? VaccinationStatus.APPLIED
            : VaccinationStatus.PENDING,
          petId: pet.id,
          vaccineId: vaccine.id,
          veterinarianId: Math.random() > 0.5 ? vet1.id : vet2.id,
        },
      })
      vaccinations.push(vaccination)
    }
  }

  // Vacunaciones para gatos
  const catPets = pets.filter((pet) => pet.species === Species.CAT)
  const catVaccines = vaccines.filter(
    (vaccine) => vaccine.species === Species.CAT,
  )

  for (const pet of catPets) {
    for (const vaccine of catVaccines) {
      const isApplied = Math.random() > 0.4 // 60% aplicadas

      const vaccination = await prisma.vaccination.create({
        data: {
          appliedAt: isApplied ? twoMonthsAgo : null,
          nextDueDate: isApplied ? oneYearLater : twoMonthsLater,
          status: isApplied
            ? VaccinationStatus.APPLIED
            : VaccinationStatus.PENDING,
          petId: pet.id,
          vaccineId: vaccine.id,
          veterinarianId: Math.random() > 0.5 ? vet1.id : vet2.id,
        },
      })
      vaccinations.push(vaccination)
    }
  }

  console.log('💉 Vacunaciones creadas')

  // Crear recordatorios para vacunaciones pendientes
  const pendingVaccinations = vaccinations.filter(
    (v) => v.status === VaccinationStatus.PENDING,
  )

  for (const vaccination of pendingVaccinations) {
    if (vaccination.nextDueDate) {
      await prisma.reminder.create({
        data: {
          dueDate: vaccination.nextDueDate,
          notified: Math.random() > 0.7, // 30% ya notificados
          vaccinationId: vaccination.id,
        },
      })
    }
  }

  console.log('⏰ Recordatorios creados')

  // Mostrar resumen
  const summary = {
    usuarios: await prisma.user.count(),
    clientes: await prisma.client.count(),
    mascotas: await prisma.pet.count(),
    vacunas: await prisma.vaccine.count(),
    vacunaciones: await prisma.vaccination.count(),
    recordatorios: await prisma.reminder.count(),
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
