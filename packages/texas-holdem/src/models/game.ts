import { Deck } from './deck'
import type { Player } from './player'

export class TexasHoldem {
  public players: Player[] = []
  public round: number = 0
  public currentPlayerIndex = 0
  public decks: Deck[] = [new Deck()]

  join(player: Player) {
    this.players.push(player)
  }
}
