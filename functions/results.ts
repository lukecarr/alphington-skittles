import { Handler } from '@netlify/functions'
import type { Game, Team, Score } from '@prisma/client'
import { prisma } from '~/lib/prisma'

const get = async () => {
  const data = await prisma.game.findMany({
    include: {
      players: { include: { scores: true, player: { include: { team: true }} } },
      homeTeam: true,
      awayTeam: true,
    },
  })

  const res: (Game & {
    homeTeam: Team;
    awayTeam: Team;
    result: {
      homeTeamPins: number;
      awayTeamPins: number;
      homeTeamPoints: number;
      awayTeamPoints: number;
    };
  })[] = []

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
      result.homeTeamPoints += homeLeg > awayLeg ? 1 : 0
      result.awayTeamPoints += awayLeg > homeLeg ? 1 : 0
    }

    if (result.homeTeamPins > result.awayTeamPins) {
      result.homeTeamPoints += 6
    } else if (result.awayTeamPins > result.homeTeamPins) {
      result.awayTeamPoints += 6
    } else {
      result.homeTeamPoints += 3
      result.awayTeamPoints += 3
    }

    res.push({ ...game, result })
  }

  return res
}

const handler: Handler = async ({ httpMethod }) => {
  if (httpMethod === 'GET') {
    const results = await get()
    return {
      statusCode: 200,
      body: JSON.stringify({ results })
    }
  } else {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: true })
    }
  }
}

export { handler }
