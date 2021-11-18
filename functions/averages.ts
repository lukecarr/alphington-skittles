import { Handler } from '@netlify/functions'
import { prisma } from '~/lib/prisma'

const get = async () => {
  const players = await prisma.player.findMany({
    include: {
      games: {
        include: { scores: true },
      },
    },
  })

  return players.map(({ id, name, gender, games }) => {
    const pins = games.map(({ scores }) => scores.map(({ score }) => score).reduce((a, b) => a + b)).reduce((a, b) => a + b)
    return {
      id,
      name,
      gender,
      played: games.length,
      pins,
      average: pins / games.length,
    }
  }).sort((a, b) => b.average - a.average || b.played - a.played)
}

const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod === 'GET') {
    return {
      statusCode: 200,
      body: JSON.stringify({ players: await get() })
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
