import { beforeEach, describe, expect, it } from 'vitest'
import { TexasHoldem } from '../src/models/game'
import { Player } from '../src/models/player'

describe('pre flop', () => {
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
  })

  it('game start', () => {
    game.start()
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('d')
    expect(game.bet).toBe(20)
    expect(game.pot).toBe(30)
    expect(game.communityCards.length).toBe(0)
    expect(game.players.every(({ holeCards }) => holeCards.length === 2)).toBe(true)
  })

  it('call', () => {
    game.start()
    game.player.call()
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('e')
    expect(game.bet).toBe(20)
    expect(game.pot).toBe(50)
  })

  it('raise', () => {
    game.start()
    game.player.raise(50)
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('e')
    expect(game.bet).toBe(50)
    expect(game.pot).toBe(80)
  })

  it('fold', () => {
    game.start()
    game.player.fold()
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('e')
    expect(game.unfoldedPlayers.length).toBe(4)
    expect(game.bet).toBe(20)
    expect(game.pot).toBe(30)
  })

  it('sb', () => {
    game.start()
    game.player.call()
    game.player.raise(50)
    game.player.call()
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('b')
    expect(game.bet).toBe(50)
    expect(game.pot).toBe(150)
  })

  it('bb call', () => {
    game.start()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    expect(game.round).toBe('flop')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(100)
  })

  it('bb raise', () => {
    game.start()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.raise(50)
    expect(game.round).toBe('pre-flop')
    expect(game.player.name).toBe('d')
    expect(game.bet).toBe(50)
    expect(game.pot).toBe(150)
  })
})
