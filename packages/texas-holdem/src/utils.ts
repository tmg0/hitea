import type { Socket } from 'socket.io'
import type { Card } from './models/card'
import { RANK } from './consts'

export const isString = (value: any): value is string => typeof value === 'string'

export const isNumber = (value: any): value is number => typeof value === 'number'

export function getQuery<T = any>(socket: Socket) {
  return socket.handshake.query as T
}

export function isRoyalFlush(cards: Card[]) {
  const aceStraight = [10, 11, 12, 13, 14]
  const ranks = cards.map(({ rank }) => rank).sort((a, b) => a - b)
  return JSON.stringify(aceStraight) === JSON.stringify(ranks)
}

export function isStraightFlush(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach(({ suit }) => {
    if (!counts[suit])
      counts[suit] = 0
    counts[suit]++
  })

  const [suit] = Object.entries(counts).find(([_, value]) => value === 5) ?? []
  const sameSuits = cards.filter(card => card.suit === suit as any)
  return isStraight(sameSuits)
}

export function isFourOfAKind(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach((card) => {
    if (!counts[card.rank])
      counts[card.rank] = 0
    counts[card.rank]++
  })

  return Object.values(counts).some(value => value === 4)
}

export function isFullHouse(cards: Card[]) {
  return isThreeOfAKind(cards) && isOnePair(cards)
}

export function isFlush(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach(({ suit }) => {
    if (!counts[suit])
      counts[suit] = 0
    counts[suit]++
  })

  return Object.values(counts).some(value => value === 5)
}

export function isStraight(cards: Card[]) {
  const sorted = cards.sort((a, b) => a.rank - b.rank)
  const aceStraight = [2, 3, 4, 5, 14]
  if (JSON.stringify(sorted.map(({ rank }) => rank)) === JSON.stringify(aceStraight))
    return true
  return isConsecutive(sorted)
}

export function isConsecutive(cards: Card[]): boolean {
  for (let i = 1; i < cards.length; i++) {
    if (cards[i].rank !== cards[i - 1].rank + 1)
      return false
  }
  return true
}

export function isThreeOfAKind(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach((card) => {
    if (!counts[card.rank])
      counts[card.rank] = 0
    counts[card.rank]++
  })

  return Object.values(counts).some(value => value === 3)
}

export function isTwoPair(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach((card) => {
    if (!counts[card.rank])
      counts[card.rank] = 0
    counts[card.rank]++
  })

  const pairs = Object.values(counts).filter(value => value === 2) ?? []

  return pairs.length > 1
}

export function isOnePair(cards: Card[]) {
  const counts: Record<string, number> = {}

  cards.forEach((card) => {
    if (!counts[card.rank])
      counts[card.rank] = 0
    counts[card.rank]++
  })

  return Object.values(counts).some(value => value === 2)
}

export function calcRank(cards: Card[]) {
  if (isRoyalFlush(cards))
    return RANK.ROYAL_FLUSH
  if (isStraightFlush(cards))
    return RANK.STRAIGHT_FLUSH
  if (isFourOfAKind(cards))
    return RANK.FOUR_OF_A_KIND
  if (isFullHouse(cards))
    return RANK.FULL_HOUSE
  if (isFlush(cards))
    return RANK.FLUSH
  if (isStraight(cards))
    return RANK.STRAIGHT
  if (isThreeOfAKind(cards))
    return RANK.THREE_OF_A_KIND
  if (isTwoPair(cards))
    return RANK.TWO_PAIR
  if (isOnePair(cards))
    return RANK.ONE_PAIR
  return RANK.HIGH_CARD
}
