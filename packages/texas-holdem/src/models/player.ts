import { nanoid } from 'nanoid'
import type { Card } from './card'

export type PlayerStatus = 'active' | 'folded' | 'all-in'

export class Player {
  public id: string = nanoid()
  public name: string = this.id
  public chips: number = 0
  public hand: Card[] = []
  public bet: number = 0
  public status: PlayerStatus = 'active'

  constructor(options: Partial<Player> = {}) {
    if (options.id)
      this.id = options.id
    if (options.name)
      this.name = options.name
    if (options.chips)
      this.chips = options.chips
  }

  clearHand() {
    this.hand = []
  }

  resetBet() {
    this.bet = 0
  }
}
