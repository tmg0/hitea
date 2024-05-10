import { createStorage } from 'unstorage'
import fsLiteDriver from 'unstorage/drivers/fs-lite'

export const storage = createStorage({
  driver: fsLiteDriver({ base: '.' }),
})
