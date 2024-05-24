import { describe, expect, it } from 'vitest'
import { Card } from '../src/models/card'
import { Player } from '../src/models/player'

function lt(a: Card[], b: Card[]) {
  const playerA = new Player({ holeCards: a })
  const playerB = new Player({ holeCards: b })
  return playerA.lt(playerB)
}

describe('lt', () => {
  it('royal flush', () => {
    const royalFlush = [
      new Card(10, 'hearts'),
      new Card(11, 'hearts'),
      new Card(12, 'hearts'),
      new Card(13, 'hearts'),
      new Card(14, 'hearts'),
    ]

    const hers = [
      new Card(9, 'hearts'),
      new Card(10, 'hearts'),
      new Card(11, 'hearts'),
      new Card(12, 'hearts'),
      new Card(13, 'hearts'),
    ]

    expect(lt(royalFlush, hers)).toBe(1)
  })

  it('straight flush', () => {
    const mine = [
      new Card(14, 'hearts'),
      new Card(2, 'hearts'),
      new Card(3, 'hearts'),
      new Card(4, 'hearts'),
      new Card(5, 'hearts'),
    ]

    const hers = [
      new Card(9, 'hearts'),
      new Card(10, 'hearts'),
      new Card(11, 'hearts'),
      new Card(12, 'hearts'),
      new Card(13, 'hearts'),
    ]

    expect(lt(mine, hers)).toBe(-1)
  })
})
