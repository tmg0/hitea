import type { Suit } from '../types'
import { Card } from './card'

export class Deck {
  public cards: Card[] = []

  constructor() {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
    const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

    for (const suit of suits) {
      for (const rank of ranks)
        this.cards.push(new Card(rank, suit))
    }
    this.shuffle()
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]]
    }
  }

  deal() {
    return this.cards.pop()
  }
}
