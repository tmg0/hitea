import { isString } from '../utils'
import type { Card } from './card'
import { Deck } from './deck'
import type { Player } from './player'

type Status = 'pending' | 'ongoing' | 'finished'
type Round = undefined | 'pre-flop' | 'flop' | 'turn' | 'river' | 'showdown'

export class Game {
  start(..._: any) {}
  join(..._: any) {}
  exit(..._: any) {}

  get player(): any { return {} }
  get isEmpty(): boolean { return true }
  get data(): any { return this }
}

export class TexasHoldem extends Game {
  public players: Player[] = []
  public round: Round = undefined
  public decks: Deck[] = []
  public communityCards: Card[] = []
  public maxPlayers: number = 10
  public pot: number = 0
  public bet: number = 0
  public status: Status = 'pending'
  public winners: Player[] = []

  private _turn = 0
  private _player = 0
  private _dealer = 0

  join(player: Player) {
    if (this.players.length >= this.maxPlayers)
      return
    player.join(this)
    this.players.push(player)
  }

  exit(player: Player | string) {
    const _id = isString(player) ? player : player.id
    const _idx = this.players.findIndex(({ id }) => id === _id)
    if (_idx < 0)
      return
    if (this.round !== undefined)
      this.players[_idx].fold()
    this.players.splice(_idx, 1)
  }

  start() {
    if (this.players.length < 2)
      return

    this.status = 'ongoing'
    this.decks = [new Deck()]
    this.shuffle()

    this.players.forEach((player) => {
      player.isBB = false
      player.isSB = false
    })

    this.players.forEach((player) => {
      player.holeCards = [
        this.deal(),
        this.deal(),
      ]
    })

    this._turn = 0
    this._player = this._dealer
    this.round = 'pre-flop'
    this.nextPlayer()
    this.player.isSB = true
    this.player.raise(10)
    this.player.isBB = true
    this.player.raise(20)
  }

  finish() {
    this._dealer++
    if (this._dealer >= this.players.length)
      this._dealer = 0
  }

  nextIndex() {
    this._player = this._player + 1
    if (this._player >= this.players.length)
      this._player = 0
  }

  nextPlayer() {
    if (this.unfoldedPlayers.length === 1) {
      this.winners = this.unfoldedPlayers
      this.onFinish()
      return
    }

    const isPreFlop = this.round === 'pre-flop'

    if (isPreFlop && this.player.isSB && this.isEven) {
      this.nextIndex()
      return
    }

    if (this.isEven) {
      this.nextIndex()
      this.nextRound()
      return
    }

    this.nextIndex()

    if (['all-in', 'folded'].includes(this.player.status))
      this.nextPlayer()
  }

  nextRound() {
    let _i = this._dealer
    const to = this.players.length + this._dealer - 1
    for (_i; _i < to; _i++) {
      if (this.players[_i].status === 'active') {
        this._player = _i
        break
      }
    }

    this._turn = this._turn + 1
    this.bet = 0
    this.players.forEach((player) => {
      player.resetBet()
    })

    if (this._turn === 1)
      this.onFlop()
    if (this._turn === 2)
      this.onTurn()
    if (this._turn === 3)
      this.onRiver()
    if (this._turn === 4)
      this.onShowdown()
  }

  onFlop() {
    this.round = 'flop'
    this.communityCards = [
      this.deal(),
      this.deal(),
      this.deal(),
    ]
  }

  onTurn() {
    this.round = 'turn'
    this.communityCards = [
      ...this.communityCards,
      this.deal(),
    ]
  }

  onRiver() {
    this.round = 'river'
    this.communityCards = [
      ...this.communityCards,
      this.deal(),
    ]
  }

  onShowdown() {
    let _winners: Player[] = [this.players[0]]

    for (const player of this.players) {
      if (player.lt(_winners[0]) > 0)
        _winners = [player]
      if (player.lt(_winners[0]) === 0)
        _winners.push(player)
    }

    this.round = 'showdown'
    this.winners = _winners
    this.onFinish()
  }

  onFinish() {
    this.status = 'finished'
    this.winners.forEach(winner => winner.scoop())
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

  get isEmpty() {
    return this.players.length < 1
  }

  get isEven() {
    return this.unfoldedPlayers.every(({ bet, status }) => {
      if (bet === undefined)
        return false
      return status === 'all-in' || bet === this.bet
    })
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
      maxPlayers: this.maxPlayers,
      pot: this.pot,
      bet: this.bet,
    }
  }
}
