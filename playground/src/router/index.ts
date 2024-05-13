import Room from '../components/Room'
import SignIn from '../components/SignIn'
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
