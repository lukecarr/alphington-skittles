import { Handler } from '@netlify/functions'
import type { Score } from '@prisma/client'
import { prisma } from '~/lib/prisma'
import { $redis } from '~/lib/redis'

const get = async () => {
  let highest = {
    score: 0,
    team: '',
    opponent: '',
    date: new Date(),
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

    const result = {
      homeTeamPins: 0,
      awayTeamPins: 0,
      homeTeamPoints: 0,
      awayTeamPoints: 0,
    }

    for (let i = 1; i <= 6; i++) {
      const homeLeg = ([] as Score[]).concat(...homePlayers.map(player => player.scores)).filter(score => score.leg === i).map(({ score }) => score).reduce((a, b) => a + b, 0)
      const awayLeg = ([] as Score[]).concat(...awayPlayers.map(player => player.scores)).filter(score => score.leg === i).map(({ score }) => score).reduce((a, b) => a + b, 0)
      result.homeTeamPins += homeLeg
      result.awayTeamPins += awayLeg
    }

    if (highest.score < result.homeTeamPins) {
      highest = {
        score: result.homeTeamPins,
        team: game.homeTeam.name,
        opponent: game.awayTeam.name,
        date: game.dateTime,
      }
    } 
    if (highest.score < result.awayTeamPins) {
      highest = {
        score: result.awayTeamPins,
        team: game.awayTeam.name,
        opponent: game.homeTeam.name,
        date: game.dateTime,
      }
    }
  }

  return highest
}

const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod === 'GET') {
    const redis = $redis()

    let highest = await redis.get('stats/highest-team-score')
    if (highest === null) {
      highest = JSON.stringify(await get())
      await redis.set('stats/highest-team-score', highest, 'EX', 60 * 60 * 24)
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
