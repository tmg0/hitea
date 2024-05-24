import { nanoid } from 'nanoid'
import { calcRank, isConsecutive } from '../utils'
import { RANK } from '../consts'
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
    if (options.holeCards)
      this.holeCards = options.holeCards
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
    this.chips += (this._game.pot / this._game.winners.length) ?? 0
  }

  lt(player: Player): 1 | 0 | -1 {
    let res = 0

    const mine = [...(this._game?.communityCards ?? []), ...this.holeCards]
    const hers = [...(this._game?.communityCards ?? []), ...player.holeCards]
    const myRank = calcRank(mine)
    const herRank = calcRank(hers)

    if (myRank !== herRank)
      res = myRank - herRank

    if ([RANK.STRAIGHT, RANK.STRAIGHT_FLUSH].includes(myRank)) {
      if (!isConsecutive(mine) && !isConsecutive(hers))
        return 0
      if (!isConsecutive(mine) && isConsecutive(hers))
        return -1
      if (isConsecutive(mine) && isConsecutive(hers))
        return 1
    }

    const myMax = mine.reduce((p, c) => (p.rank > c.rank ? p : c))
    const herMax = hers.reduce((p, c) => (p.rank > c.rank ? p : c))

    res = myMax.rank - herMax.rank

    if (res > 0)
      return 1
    if (res < 0)
      return -1
    return 0
  }

  get data() {
    return {
      id: this.id,
      name: this.name,
      chips: this.chips,
      holeCards: this._game.round === 'showdown' ? this.holeCards : [],
      bet: this.bet,
      status: this.status,
    }
  }
}
