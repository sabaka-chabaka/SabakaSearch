export interface SearchRequest {
  query: string
  userId?: string
}

export interface SearchPageDto {
  id: string
  url: string
  title: string
  snippet: string
  relevanceScore: number
  position: number
}

export interface SearchResultDto {
  queryId: string
  rawQuery: string
  resultCount: number
  executionMs: number
  pages: SearchPageDto[]
}

export interface PopularQueryDto {
  query: string
  count: number
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface UserDto {
  id: string
  username: string
  email: string
  createdAt: string
  lastLoginAt: string | null
}

export interface UserHistoryDto {
  queryId: string
  rawQuery: string
  resultCount: number
  createdAt: string
}

export interface ErrorResponse {
  error: string
  detail?: string
}
