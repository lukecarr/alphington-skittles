import { PrismaClient } from '@prisma/client'

const createPrisma = () => new PrismaClient()

export const prisma = createPrisma()
