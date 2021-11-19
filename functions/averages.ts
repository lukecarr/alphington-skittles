import { Handler } from '@netlify/functions'
import { prisma } from '~/lib/prisma'

type Player = {
  Player: string;
  Team: string;
  Played: number;
  Average: number;
}

const get = async ({ gender, min }: { gender: boolean; min: number }) => {
  const players = gender ? await prisma.$queryRaw<Player[]>`
    SELECT * FROM averagemens WHERE Played >= ${min}
  ` : await prisma.$queryRaw<Player[]>`
    SELECT * FROM averageladies WHERE Played >= ${min}
  `

  return players
}

const handler: Handler = async ({ httpMethod, queryStringParameters }) => {
  if (httpMethod === 'GET') {
    const players = await get({
      gender: (queryStringParameters?.gender || 'male') === 'male',
      min: parseInt(queryStringParameters?.min || '5')
    })
    return {
      statusCode: 200,
      body: JSON.stringify({ players: players.map((x, index) => ({ ...x, index: index + 1 }))  })
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
