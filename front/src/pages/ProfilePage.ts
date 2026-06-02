import { api } from '../api/client'
import type { UserHistoryDto } from '../api/types'
import { store } from '../store/store'

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function renderHistory(history: UserHistoryDto[]): string {
  if (!history.length) {
    return '<p class="profile-empty">Поисков пока не было — <button class="link-btn" id="go-search-from-profile">попробуй что-нибудь найти</button></p>'
  }
  return history
    .map(
      h => `
      <div class="history-row">
        <div class="history-row__left">
          <span class="history-query">${h.rawQuery}</span>
          <span class="history-date">${fmtDate(h.createdAt)}</span>
        </div>
        <span class="history-count">${h.resultCount} рез.</span>
      </div>
    `,
    )
    .join('')
}

export function ProfilePage(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'profile-page'

  const style = document.createElement('style')
  style.textContent = `
    .profile-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 1.5rem 4rem;
    }
    .profile-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: var(--border);
    }
    .profile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--ink);
      color: var(--paper);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-serif);
      font-size: 26px;
      font-style: italic;
      flex-shrink: 0;
      margin-bottom: 12px;
    }
    .profile-info {}
    .profile-username {
      font-family: var(--font-serif);
      font-style: italic;
      font-size: 2rem;
      line-height: 1.1;
      margin-bottom: 4px;
    }
    .profile-email {
      font-size: 13px;
      font-family: var(--font-mono);
      color: var(--ink-3);
    }
    .profile-meta {
      margin-top: 8px;
      display: flex;
      gap: 16px;
    }
    .profile-meta-item {
      font-size: 12px;
      color: var(--ink-3);
    }
    .profile-meta-item strong {
      color: var(--ink);
      font-weight: 500;
    }
    .profile-logout {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
      border: 1px solid var(--paper-3);
      padding: 6px 12px;
      border-radius: var(--radius);
      transition: all var(--transition);
    }
    .profile-logout:hover {
      border-color: var(--accent);
      color: var(--accent);
    }
    .section-title {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 1rem;
    }
    .history-list { display: flex; flex-direction: column; }
    .history-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: var(--border-thin);
      gap: 1rem;
    }
    .history-row:last-child { border-bottom: none; }
    .history-row__left {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    .history-query {
      font-size: 14px;
      font-family: var(--font-mono);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .history-date {
      font-size: 11px;
      color: var(--ink-3);
    }
    .history-count {
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
      flex-shrink: 0;
    }
    .history-loader {
      display: flex;
      gap: 5px;
      padding: 1.5rem 0;
    }
    .history-loader span {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--ink-3);
      animation: bounce 0.9s infinite ease-in-out both;
    }
    .history-loader span:nth-child(2) { animation-delay: 0.15s; }
    .history-loader span:nth-child(3) { animation-delay: 0.3s; }
    .profile-empty {
      font-size: 13px;
      color: var(--ink-3);
      font-style: italic;
    }
    .link-btn {
      color: var(--accent);
      font-size: 13px;
      text-decoration: underline;
      font-style: normal;
    }
    .load-more-btn {
      margin-top: 1.25rem;
      font-size: 12px;
      font-family: var(--font-mono);
      color: var(--ink-3);
      border: 1px solid var(--paper-3);
      padding: 7px 16px;
      border-radius: var(--radius);
      transition: all var(--transition);
    }
    .load-more-btn:hover {
      border-color: var(--ink);
      color: var(--ink);
    }
    @media (max-width: 640px) {
      .profile-page { padding: 1.5rem 1rem 3rem; }
      .profile-header { flex-direction: column; gap: 1rem; }
    }
  `
  el.prepend(style)

  const { user } = store.getState()
  if (!user) {
    store.setState({ view: 'search' })
    return el
  }

  const initials = user.username.slice(0, 2).toUpperCase()

  el.innerHTML += `
    <div class="profile-header">
      <div>
        <div class="profile-avatar">${initials}</div>
        <div class="profile-info">
          <h2 class="profile-username">${user.username}</h2>
          <p class="profile-email">${user.email}</p>
          <div class="profile-meta">
            <span class="profile-meta-item">Зарегистрирован: <strong>${fmtDate(user.createdAt)}</strong></span>
          </div>
        </div>
      </div>
      <button class="profile-logout" id="logout-btn">Выйти</button>
    </div>
    <p class="section-title">История поисков</p>
    <div id="history-container">
      <div class="history-loader"><span></span><span></span><span></span></div>
    </div>
    <div id="history-actions"></div>
  `

  const historyContainer = el.querySelector('#history-container') as HTMLElement
  const historyActions = el.querySelector('#history-actions') as HTMLElement

  el.querySelector('#logout-btn')!.addEventListener('click', () => {
    store.setState({ user: null, view: 'search', history: [], searchResult: null })
  })

  let currentLimit = 20

  async function loadHistory(limit: number) {
    historyContainer.innerHTML = `<div class="history-loader"><span></span><span></span><span></span></div>`
    historyActions.innerHTML = ''
    store.setState({ historyLoading: true })

    try {
      const history = await api.users.getHistory(user!.id, limit)
      store.setState({ history, historyLoading: false })
      historyContainer.innerHTML = `<div class="history-list">${renderHistory(history)}</div>`

      if (history.length === limit) {
        historyActions.innerHTML = `<button class="load-more-btn" id="load-more">Загрузить ещё</button>`
        historyActions.querySelector('#load-more')!.addEventListener('click', () => {
          currentLimit += 20
          loadHistory(currentLimit)
        })
      }

      historyContainer.querySelector('#go-search-from-profile')?.addEventListener('click', () => {
        store.setState({ view: 'search' })
      })
    } catch {
      historyContainer.innerHTML = '<p class="profile-empty">Не удалось загрузить историю</p>'
      store.setState({ historyLoading: false })
    }
  }

  loadHistory(currentLimit)

  return el
}
