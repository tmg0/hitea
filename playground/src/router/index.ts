import Room from '../pages/Room'
import SignIn from '../pages/SignIn'
import type { Route } from '../hooks/useRouter'

export const routes: Route[] = [
  {
    path: '/sign-in',
    component: SignIn,
  },
  {
    path: '/room',
    component: Room,
  },
]
