import { isString } from '../utils'
import type { Card } from './card'
import { Deck } from './deck'
import type { Player } from './player'

export type GameStatus = 'pending' | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'

export type Event = 'call' | 'raise' | 'fold' | 'check' | 'all-in'

export class Game {
  start(..._: any) {}
  join(..._: any) {}
  leave(..._: any) {}
  get isEmpty(): boolean { return true }
  get data(): any { return this }
}

export class TexasHoldem extends Game {
  public players: Player[] = []
  public round: number = 0
  public decks: Deck[] = []
  public communityCards: Card[] = []
  public status: GameStatus = 'pending'
  public maxPlayers: number = 10
  public pot: number = 0
  public bet: number = 0

  private _player = 0
  private _dealer = 0

  join(player: Player) {
    if (this.players.length >= this.maxPlayers)
      return
    player.join(this)
    this.players.push(player)
  }

  leave(player: Player | string) {
    const _id = isString(player) ? player : player.id
    const _idx = this.players.findIndex(({ id }) => id === _id)
    if (_idx < 0)
      return
    this.players[_idx].fold()
    this.players.splice(_idx, 1)
  }

  start() {
    if (this.players.length < 2)
      return

    this.decks = [new Deck()]
    this.shuffle()
    this.players.forEach((player) => {
      player.holeCards = [
        this.deal(),
        this.deal(),
      ]
    })

    this.round = 0
    this.status = 'pre-flop'
    this._player = this._dealer
    this.nextPlayer()
    this.player.raise(10)
    this.nextPlayer()
    this.player.raise(20)
    this.nextPlayer()
  }

  finish() {
    this._dealer++
    if (this._dealer >= this.players.length)
      this._dealer = 0
  }

  nextPlayer() {
    if (this.unfoldedPlayers.length === 1)
      this.unfoldedPlayers[0].scoop()

    if (this.players.every(({ bet, status }) => status === 'all-in' || bet === this.bet))
      this.nextRound()

    if (this.status === 'showdown')

      this._player++
    if (this._player >= this.players.length)
      this._player = 0

    if (this.player.status === 'all-in')
      this.nextPlayer()
  }

  nextRound() {
    this.round++
    this._player = this._dealer
    this.players.forEach((player) => {
      player.resetBet()
    })

    if (this.round === 1)
      this.onFlop()
    if (this.round === 2)
      this.onTurn()
    if (this.round === 3)
      this.onRiver()
    if (this.round === 4)
      this.onShowdown()
  }

  onFlop() {
    this.status = 'flop'
    this.communityCards = [
      this.deal(),
      this.deal(),
      this.deal(),
    ]
  }

  onTurn() {
    this.status = 'turn'
    this.communityCards = [
      ...this.communityCards,
      this.deal(),
    ]
  }

  onRiver() {
    this.status = 'river'
    this.communityCards = [
      ...this.communityCards,
      this.deal(),
    ]
  }

  onShowdown() {
    this.status = 'showdown'
  }

  shuffle() {
    this.decks.forEach((deck) => {
      deck.shuffle()
    })
  }

  deal() {
    for (const deck of this.decks) {
      if (deck.cards.length > 0)
        return deck.deal()!
    }
    const _d = new Deck()
    this.decks.push(_d)
    return _d.deal()!
  }

  handler(event: Event, args: any) {
    if (event === 'raise')
      this.player.raise(args)
  }

  get isEmpty() {
    return this.players.length < 1
  }

  get unfoldedPlayers() {
    return this.players.filter(({ status }) => status !== 'folded')
  }

  get player() {
    return this.players[this._player]
  }

  get dealer() {
    return this.players[this._dealer]
  }

  get data() {
    const _players = this.players.map(({ data }) => data)

    return {
      players: _players,
      round: this.round,
      decks: [],
      communityCards: this.communityCards,
      status: this.status,
      maxPlayers: this.maxPlayers,
      pot: this.pot,
      bet: this.bet,
    }
  }
}
