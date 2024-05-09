import type { Suit } from '../types'

export class Card {
  constructor(
    public rank: number,
    public suit: Suit,
  ) {}
}
