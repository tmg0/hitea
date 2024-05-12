export interface Route {
  name?: string
  path?: string
  query?: Record<string, any>
  component?: () => React.JSX.Element
}

export default function useRouter() {
  function push(_: Omit<Route, 'component'>) {}

  return {
    push,
  }
}
