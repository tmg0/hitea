import { beforeEach, describe, expect, it } from 'vitest'
import { TexasHoldem } from '../src/models/game'
import { Player } from '../src/models/player'

describe('flop', () => {
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
  })

  it('flop round', () => {
    expect(game.round).toBe('flop')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.communityCards.length).toBe(3)
    expect(game.players.every(({ holeCards }) => holeCards.length === 2)).toBe(true)
  })

  it('check', () => {
    game.player.check()
    expect(game.round).toBe('flop')
    expect(game.player.name).toBe('b')
    expect(game.bet).toBe(0)
  })

  it('checked to next round', () => {
    game.player.check()
    game.player.check()
    game.player.check()
    game.player.check()
    game.player.check()
    expect(game.round).toBe('turn')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(100)
  })

  it('raise after checked', () => {
    game.player.check()
    game.player.raise(50)
    game.player.call()
    game.player.call()
    game.player.call()
    expect(game.round).toBe('flop')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(50)
    expect(game.pot).toBe(300)
  })

  it('call after checked', () => {
    game.player.check()
    game.player.raise(50)
    game.player.call()
    game.player.call()
    game.player.call()
    game.player.call()
    expect(game.round).toBe('turn')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(350)
    expect(game.communityCards.length).toBe(4)
  })

  it('player "a" scooped after others folded', () => {
    game.player.raise(100)
    game.player.fold()
    game.player.fold()
    game.player.fold()
    game.player.fold()
    expect(game.round).toBe('flop')
    expect(game.status).toBe('finished')
    expect(game.bet).toBe(100)
    expect(game.pot).toBe(200)
    expect(game.players[0].chips).toBe(10080)
  })

  it('call after raised', () => {
    game.player.fold()
    game.player.raise(100)
    game.player.fold()
    game.player.call()
    game.player.fold()
    expect(game.round).toBe('turn')
    expect(game.player.name).toBe('b')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(300)
  })

  it('re-raise', () => {
    game.player.raise(100)
    game.player.fold()
    game.player.fold()
    game.player.raise(200)
    game.player.fold()
    game.player.call()
    expect(game.round).toBe('turn')
    expect(game.player.name).toBe('a')
    expect(game.bet).toBe(0)
    expect(game.pot).toBe(500)
  })
})
