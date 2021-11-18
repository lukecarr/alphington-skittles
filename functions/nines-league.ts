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
    const totals = games.map(({ scores }) => ({
      nines: scores.filter(({ score }) => score === 9).length,
      spares: scores.filter(({ spare }) => spare).length,
    })).reduce((a, b) => ({
      nines: a.nines + b.nines,
      spares: a.spares + b.spares
    }))

    return {
      id,
      name,
      gender,
      played: games.length,
      ...totals,
      total: totals.nines + totals.spares,
    }
  }).sort((a, b) => a.total - a.total || b.spares - a.spares || b.played - a.played)
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
