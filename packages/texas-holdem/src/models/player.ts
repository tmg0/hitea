import { nanoid } from 'nanoid'
import type { Card } from './card'
import type { TexasHoldem } from './game'

export type PlayerStatus = 'active' | 'folded' | 'all-in'

export class Player {
  public id: string = ''
  public name: string = ''
  public chips: number = 10000
  public holeCards: Card[] = []
  public bet: number | undefined = undefined
  public status: PlayerStatus = 'active'
  public isBB = false
  public isSB = false

  private _game!: TexasHoldem

  constructor(options: Partial<Player> = {}) {
    this.id = options.id ?? nanoid()
    this.name = options.name ?? this.id
    if (options.chips)
      this.chips = options.chips
  }

  resetBet() {
    this.bet = undefined
  }

  join(game: TexasHoldem) {
    this._game = game
  }

  call() {
    const _diff = this._game.bet - (this.bet ?? 0)
    this.bet = this._game.bet
    this.chips = this.chips - _diff
    this._game.pot = this._game.pot + _diff
    this._game.nextPlayer()
  }

  check() {
    this.bet = 0
    this._game.nextPlayer()
  }

  raise(value: number) {
    if (this._game.bet > value)
      return
    this._game.bet = value
    this.bet = (this.bet ?? 0) + value
    this.chips = this.chips - value
    this._game.pot = this._game.pot + value
    this._game.nextPlayer()
  }

  fold() {
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
