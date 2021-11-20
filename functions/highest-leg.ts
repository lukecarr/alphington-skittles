import { Handler } from '@netlify/functions'
import { format } from 'date-fns'
import type { Team, Score } from '@prisma/client'
import { prisma } from '~/lib/prisma'
import { $redis } from '~/lib/redis'

const get = async () => {
  let highest = {
    leg: 0,
    score: 0,
    team: null as Team | null,
    opponent: null as Team | null,
    date: '',
  }

  const data = await prisma.game.findMany({
    include: {
      players: { include: { scores: true, player: { include: { team: true }} } },
      homeTeam: true,
      awayTeam: true,
    },
  })

  for (const game of data) {
    const homePlayers = game.players.filter(player => player.player.teamId === game.homeTeamId)
    const awayPlayers = game.players.filter(player => player.player.teamId === game.awayTeamId)

    for (let i = 1; i <= 6; i++) {
      const homeLeg = ([] as Score[]).concat(...homePlayers.map(player => player.scores)).filter(score => score.leg === i).map(({ score }) => score).reduce((a, b) => a + b, 0)
      if (highest.score < homeLeg) {
        highest = {
          leg: i,
          score: homeLeg,
          team: game.homeTeam,
          opponent: game.awayTeam,
          date: format(game.dateTime, 'EEE do MMM'),
        }
      }

      const awayLeg = ([] as Score[]).concat(...awayPlayers.map(player => player.scores)).filter(score => score.leg === i).map(({ score }) => score).reduce((a, b) => a + b, 0)
      if (highest.score < awayLeg) {
        highest = {
          leg: i,
          score: awayLeg,
          team: game.awayTeam,
          opponent: game.homeTeam,
          date: format(game.dateTime, 'EEE do MMM'),
        }
      }
    }
  }

  return highest
}

const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod === 'GET') {
    const redis = $redis()

    let highest = await redis.get('stats/highest-leg')
    if (highest === null) {
      highest = JSON.stringify(await get())
      await redis.set('stats/highest-leg', highest, 'EX', 60 * 60 * 24 * 7)
    }

    return {
      statusCode: 200,
      body: highest,
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
