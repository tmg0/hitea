import type { Socket } from 'socket.io'
import type { Card } from './models/card'

export const isString = (value: any): value is string => typeof value === 'string'

export const isNumber = (value: any): value is number => typeof value === 'number'

export function getQuery<T = any>(socket: Socket) {
  return socket.handshake.query as T
}

export function isRoyalFlush(_: Card[]) {
  return true
}

export function isStraightFlush(_: Card[]) {
  return true
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

export function isFullHouse(_: Card[]) {
  return true
}

export function isFlush(_: Card[]) {
  return true
}

export function isStraight(_: Card[]) {
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

  return pairs.length === 2
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
