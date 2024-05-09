import { isString } from '../utils'
import { Deck } from './deck'
import type { Player } from './player'

export type GameStatus = 'pending' | 'running'

export type Event = 'call' | 'raise' | 'fold' | 'all-in'

export class TexasHoldem {
  public players: Player[] = []
  public round: number = 0
  public sb = 0
  public bb = 1
  public decks: Deck[] = [new Deck()]
  public status: GameStatus = 'pending'
  public maxPlayers: number = 10
  public pot: number = 0

  private _player = 0

  join(player: Player) {
    player.join(this)
    this.players.push(player)
  }

  leave(player: Player | string) {
    const _id = isString(player) ? player : player.id
    const _idx = this.players.findIndex(({ id }) => id === _id)
    if (_idx > -1)
      this.players.splice(_idx, 1)
  }

  start() {
    this.status = 'running'
  }

  nextPlayer() {
    this._player++
    if (this._player >= this.players.length)
      this._player = 0
  }

  handler(event: Event, args: any) {
    if (event === 'raise')
      this.player.raise(args)
  }

  get player() {
    return this.players[this._player]
  }
}
