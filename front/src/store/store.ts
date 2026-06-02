import type { SearchResultDto, UserDto, UserHistoryDto, PopularQueryDto } from '../api/types'

type Listener = () => void

export type View = 'search' | 'register' | 'profile'

export interface AppState {
  view: View
  user: UserDto | null
  searchResult: SearchResultDto | null
  searchLoading: boolean
  popular: PopularQueryDto[]
  history: UserHistoryDto[]
  historyLoading: boolean
  error: string | null
}

function createStore(initial: AppState) {
  let state = { ...initial }
  const listeners = new Set<Listener>()

  function getState(): Readonly<AppState> {
    return state
  }

  function setState(patch: Partial<AppState>) {
    state = { ...state, ...patch }
    listeners.forEach(fn => fn())
  }

  function subscribe(fn: Listener): () => void {
    listeners.add(fn)
    return () => listeners.delete(fn)
  }

  return { getState, setState, subscribe }
}

export const store = createStore({
  view: 'search',
  user: null,
  searchResult: null,
  searchLoading: false,
  popular: [],
  history: [],
  historyLoading: false,
  error: null,
})
