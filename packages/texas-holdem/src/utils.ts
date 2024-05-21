import type { Socket } from 'socket.io'

export const isString = (value: any): value is string => typeof value === 'string'

export const isNumber = (value: any): value is number => typeof value === 'number'

export function getQuery<T = any>(socket: Socket) {
  return socket.handshake.query as T
}
