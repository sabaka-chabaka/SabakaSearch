import { api, ApiError } from '../api/client'
import type { SearchResultDto, PopularQueryDto } from '../api/types'
import { store } from '../store/store'

function renderResult(result: SearchResultDto): string {
  const pages = result.pages
    .map(
      p => `
      <article class="result-card">
        <div class="result-card__meta">
          <span class="result-pos">${p.position}</span>
          <a class="result-url" href="${p.url}" target="_blank" rel="noopener">${p.url}</a>
          <span class="result-score">${(p.relevanceScore * 100).toFixed(0)}%</span>
        </div>
        <h3 class="result-title">
          <a href="${p.url}" target="_blank" rel="noopener">${p.title}</a>
        </h3>
        <p class="result-snippet">${p.snippet}</p>
      </article>
    `,
    )
    .join('')

  return `
    <div class="results-header">
      <span class="results-count">${result.resultCount} результатов</span>
      <span class="results-time">${result.executionMs.toFixed(1)} мс</span>
    </div>
    <div class="results-list">${pages}</div>
  `
}

function renderPopular(popular: PopularQueryDto[]): string {
  if (!popular.length) return '<p class="empty-state">Пока пусто</p>'
  return popular
    .map(
      p => `
      <button class="popular-item" data-query="${p.query}">
        <span class="popular-query">${p.query}</span>
        <span class="popular-count">${p.count}</span>
      </button>
    `,
    )
    .join('')
}

export function SearchPage(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'search-page'

  const style = document.createElement('style')
  style.textContent = `
    .search-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 4rem;
      display: grid;
      grid-template-columns: 1fr 240px;
      grid-template-rows: auto 1fr;
      gap: 0 2.5rem;
    }
    .search-hero {
      grid-column: 1 / -1;
      margin-bottom: 2rem;
    }
    .search-hero__title {
      font-family: var(--font-serif);
      font-size: clamp(2.4rem, 5vw, 3.6rem);
      font-style: italic;
      line-height: 1.1;
      margin-bottom: 1.5rem;
      color: var(--ink);
    }
    .search-hero__title em {
      color: var(--accent);
      font-style: normal;
    }
    .search-form {
      display: flex;
      gap: 0;
      border: var(--border);
      border-radius: var(--radius);
      overflow: hidden;
      background: var(--paper);
    }
    .search-input {
      flex: 1;
      padding: 14px 18px;
      font-size: 16px;
      border: none;
      outline: none;
      background: transparent;
      color: var(--ink);
      font-family: var(--font-mono);
    }
    .search-input::placeholder { color: var(--ink-3); }
    .search-btn {
      padding: 14px 24px;
      background: var(--ink);
      color: var(--paper);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-left: var(--border);
      transition: background var(--transition);
      white-space: nowrap;
    }
    .search-btn:hover { background: var(--accent); }
    .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .search-main { min-width: 0; }
    .search-sidebar {}
    .sidebar-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: var(--border-thin);
    }
    .popular-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 0;
      border-bottom: var(--border-thin);
      gap: 8px;
      transition: color var(--transition);
    }
    .popular-item:hover { color: var(--accent); }
    .popular-query {
      font-size: 13px;
      font-family: var(--font-mono);
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .popular-count {
      font-size: 11px;
      font-weight: 600;
      color: var(--ink-3);
      min-width: 20px;
      text-align: right;
    }
    .results-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      padding-bottom: 10px;
      border-bottom: var(--border);
    }
    .results-count {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 18px;
    }
    .results-time {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
    }
    .results-list { display: flex; flex-direction: column; gap: 0; }
    .result-card {
      padding: 1.1rem 0;
      border-bottom: var(--border-thin);
    }
    .result-card:last-child { border-bottom: none; }
    .result-card__meta {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 4px;
    }
    .result-pos {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 500;
      color: var(--paper);
      background: var(--ink-3);
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .result-url {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      flex: 1;
    }
    .result-url:hover { color: var(--accent); }
    .result-score {
      font-size: 11px;
      font-family: var(--font-mono);
      font-weight: 500;
      color: var(--accent);
      flex-shrink: 0;
    }
    .result-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .result-title a:hover { color: var(--accent); }
    .result-snippet {
      font-size: 13px;
      color: var(--ink-2);
      line-height: 1.5;
    }
    .error-msg {
      padding: 12px 16px;
      background: var(--accent-dim);
      border-left: 3px solid var(--accent);
      font-size: 14px;
      color: var(--accent);
      margin-top: 1rem;
      font-family: var(--font-mono);
    }
    .search-loader {
      display: flex;
      gap: 5px;
      padding: 2rem 0;
    }
    .search-loader span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--ink);
      animation: bounce 0.9s infinite ease-in-out both;
    }
    .search-loader span:nth-child(2) { animation-delay: 0.15s; }
    .search-loader span:nth-child(3) { animation-delay: 0.3s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
      40% { transform: scale(1); opacity: 1; }
    }
    .empty-state {
      font-size: 13px;
      color: var(--ink-3);
      font-style: italic;
    }
    .search-placeholder {
      padding: 2rem 0;
    }
    .search-placeholder__label {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
      letter-spacing: 0.05em;
    }
    @media (max-width: 640px) {
      .search-page {
        grid-template-columns: 1fr;
        padding: 1.5rem 1rem 3rem;
      }
      .search-sidebar { order: -1; }
    }
  `
  el.prepend(style)

  el.innerHTML += `
    <div class="search-hero">
      <h1 class="search-hero__title">Найди что угодно,<br><em>быстро.</em></h1>
      <form class="search-form" id="search-form">
        <input
          class="search-input"
          id="search-input"
          type="text"
          placeholder="поисковый запрос..."
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
        />
        <button class="search-btn" type="submit" id="search-btn">Искать</button>
      </form>
      <div id="search-error"></div>
    </div>
    <main class="search-main" id="search-main">
      <div class="search-placeholder">
        <p class="search-placeholder__label">← введи запрос и нажми Искать</p>
      </div>
    </main>
    <aside class="search-sidebar">
      <p class="sidebar-title">Популярное</p>
      <div id="popular-list"></div>
    </aside>
  `

  const form = el.querySelector('#search-form') as HTMLFormElement
  const input = el.querySelector('#search-input') as HTMLInputElement
  const btn = el.querySelector('#search-btn') as HTMLButtonElement
  const mainEl = el.querySelector('#search-main') as HTMLElement
  const errorEl = el.querySelector('#search-error') as HTMLElement
  const popularList = el.querySelector('#popular-list') as HTMLElement

  async function doSearch(query: string) {
    if (!query.trim()) return

    store.setState({ searchLoading: true, error: null })
    btn.disabled = true
    mainEl.innerHTML = `<div class="search-loader"><span></span><span></span><span></span></div>`
    errorEl.innerHTML = ''

    try {
      const { user } = store.getState()
      const result = await api.search.query({ query, userId: user?.id })
      store.setState({ searchResult: result, searchLoading: false })
      mainEl.innerHTML = renderResult(result)
    } catch (err) {
      const msg = err instanceof ApiError ? err.body.error : 'Ошибка соединения'
      store.setState({ error: msg, searchLoading: false })
      mainEl.innerHTML = `<div class="search-placeholder"><p class="search-placeholder__label">← введи запрос и нажми Искать</p></div>`
      errorEl.innerHTML = `<div class="error-msg">${msg}</div>`
    } finally {
      btn.disabled = false
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault()
    doSearch(input.value)
  })

  popularList.addEventListener('click', e => {
    const item = (e.target as HTMLElement).closest('.popular-item') as HTMLElement | null
    if (!item) return
    const q = item.dataset['query'] ?? ''
    input.value = q
    doSearch(q)
  })

  async function loadPopular() {
    try {
      const popular = await api.search.popular(10, 60)
      store.setState({ popular })
      popularList.innerHTML = renderPopular(popular)
    } catch {
      popularList.innerHTML = '<p class="empty-state">Недоступно</p>'
    }
  }

  loadPopular()

  const { searchResult } = store.getState()
  if (searchResult) {
    mainEl.innerHTML = renderResult(searchResult)
    input.value = searchResult.rawQuery
  }

  return el
}
