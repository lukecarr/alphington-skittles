import { Handler } from '@netlify/functions'
import { prisma } from '~/lib/prisma'

const get = async () => {
  return await prisma.$queryRaw<{
    Player: string;
    Team: string;
    Played: number;
    Nines: number;
    Spares: number;
    Total: number;
  }[]>`SELECT * FROM ninesleague`
}

const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod === 'GET') {
    const players = await get()
    return {
      statusCode: 200,
      body: JSON.stringify({ players: players.map((x, index) => ({ ...x, index: index + 1 })) })
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
