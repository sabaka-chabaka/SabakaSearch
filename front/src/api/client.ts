import type {
  ErrorResponse,
  PopularQueryDto,
  RegisterRequest,
  SearchRequest,
  SearchResultDto,
  UserDto,
  UserHistoryDto,
} from './types'

const BASE = '/api'

class ApiError extends Error {
  constructor(
    public status: number,
    public body: ErrorResponse,
  ) {
    super(body.error)
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  if (!res.ok) {
    const body: ErrorResponse = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(res.status, body)
  }

  return res.json() as Promise<T>
}

export const api = {
  search: {
    query(req: SearchRequest) {
      return request<SearchResultDto>('/search', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    },

    popular(topN = 10, windowMinutes = 60) {
      return request<PopularQueryDto[]>(
        `/search/popular?topN=${topN}&windowMinutes=${windowMinutes}`,
      )
    },
  },

  users: {
    register(req: RegisterRequest) {
      return request<UserDto>('/users/register', {
        method: 'POST',
        body: JSON.stringify(req),
      })
    },

    getById(id: string) {
      return request<UserDto>(`/users/${id}`)
    },

    getHistory(id: string, limit = 20) {
      return request<UserHistoryDto[]>(`/users/${id}/history?limit=${limit}`)
    },
  },
}

export { ApiError }
