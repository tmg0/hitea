import { nanoid } from 'nanoid'
import { Exception } from '../consts'
import type { Card } from './card'
import type { TexasHoldem } from './game'

export type PlayerStatus = 'active' | 'folded' | 'all-in'

export class Player {
  public id: string = ''
  public name: string = ''
  public chips: number = 10000
  public holeCards: Card[] = []
  public bet: number = 0
  public status: PlayerStatus = 'active'

  private _game!: TexasHoldem

  constructor(options: Partial<Player> = {}) {
    this.id = options.id ?? nanoid()
    this.name = options.name ?? this.id
    if (options.chips)
      this.chips = options.chips
  }

  clearHoleCards() {
    this.holeCards = []
  }

  resetBet() {
    this.bet = 0
  }

  join(game: TexasHoldem) {
    this._game = game
  }

  call() {
    const _diff = this._game.bet - this.bet
    this.bet = this._game.bet
    this.chips -= _diff
  }

  check() {}

  raise(to: number) {
    if (to < this._game.bet)
      throw new Error(Exception.UNEXPECTED_BETS)
    this._game.bet = to
    this.bet = to
    this.chips -= to
  }

  fold() {
    this.clearHoleCards()
    this.status = 'folded'
    this._game.nextPlayer()
  }

  scoop() {
    this.chips += this._game.pot ?? 0
  }

  get data() {
    return {
      id: this.id,
      name: this.name,
      chips: this.chips,
      holeCards: [],
      bet: this.bet,
      status: this.status,
    }
  }
}
