import { Handler } from '@netlify/functions'
import { prisma } from '~/lib/prisma'

const get = async () => await prisma.team.findMany({ orderBy: { name: 'asc' }})

const create = async (name: string) => await prisma.team.create({ data: { name }})

const handler: Handler = async ({ httpMethod, body }) => {
  if (httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ teams: await get() })
    }
  } else if (httpMethod === 'POST') {
    return {
      statusCode: 201,
      body: JSON.stringify({ team: await create(JSON.parse(body!).name) })
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
