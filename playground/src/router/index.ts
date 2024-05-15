import type { Route } from '../hooks/useRouter'
import Room from '../pages/Room'
import SignIn from '../pages/SignIn'
import Game from '../pages/Game'

export const routes: Route[] = [
  {
    path: '/sign-in',
    component: SignIn,
  },
  {
    path: '/room',
    component: Room,
  },
  {
    path: '/game',
    component: Game,
  },
]
