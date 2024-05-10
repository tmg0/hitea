import { nanoid } from 'nanoid'
import type { Game } from './game'

type Language = 'en-US' | 'zh-CN'

export class Room {
  public id: string = nanoid()
  public name: string = this.id
  public description: string = ''
  public language: Language = 'en-US'
  public game: Game

  constructor(options: Partial<Room> & { game: Game }) {
    this.game = options.game
    if (options.name)
      this.name = options.name
    if (options.description)
      this.description = options.description
    if (options.language)
      this.language = options.language
  }

  get data() {
    return { ...this, game: this.game.data }
  }
}
