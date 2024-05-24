import { beforeEach, describe, expect, it } from 'vitest'
import { TexasHoldem } from '../src/models/game'
import { Player } from '../src/models/player'

describe('river', () => {
  let game: TexasHoldem

  beforeEach(() => {
    game = new TexasHoldem()
    const playerA = new Player({ name: 'a' })
    const playerB = new Player({ name: 'b' })
    const playerC = new Player({ name: 'c' })
    const playerD = new Player({ name: 'd' })
    const playerE = new Player({ name: 'e' })

    game.join(playerA)
    game.join(playerB)
    game.join(playerC)
    game.join(playerD)
    game.join(playerE)

    game.start()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.raise(100)
    game.player.fold()
    game.player.fold()
    game.player.raise(200)
    game.player.fold()
    game.player.call()
  })

  it('turn round', () => {
    expect(game.round).toBe('turn')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.communityCards.length).toBe(4)
    expect(game.players.every(({ holeCards }) => holeCards.length === 2)).toBe(true)
  })

  it('call after checked', () => {
    game.player.check()
    game.player.raise(100)
    game.player.call()
    expect(game.round).toBe('river')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(700)
    expect(game.communityCards.length).toBe(5)
  })
})
