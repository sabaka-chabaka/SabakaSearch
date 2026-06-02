import { store } from '../store/store'

export function Header(): HTMLElement {
  const el = document.createElement('header')
  el.className = 'site-header'

  el.innerHTML = `
    <div class="site-header__inner">
      <button class="logo" data-action="home">
        <span class="logo__dog">🐕</span>
        <span class="logo__text">SabakaSearch</span>
      </button>
      <nav class="site-nav">
        <button class="nav-btn" data-action="register">Регистрация</button>
        <button class="nav-btn nav-btn--profile hidden" data-action="profile">
          <span class="nav-btn__username"></span>
        </button>
      </nav>
    </div>
  `

  const style = document.createElement('style')
  style.textContent = `
    .site-header {
      border-bottom: var(--border);
      background: var(--paper);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .site-header__inner {
      max-width: 900px;
      margin: 0 auto;
      padding: 0 1.5rem;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .logo__dog { font-size: 20px; }
    .logo__text {
      font-family: var(--font-serif);
      font-size: 22px;
      font-style: italic;
      color: var(--ink);
    }
    .site-nav { display: flex; gap: 8px; align-items: center; }
    .nav-btn {
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      border: var(--border);
      background: var(--paper);
      color: var(--ink);
      border-radius: var(--radius);
      transition: background var(--transition);
      letter-spacing: 0.02em;
    }
    .nav-btn:hover { background: var(--paper-2); }
    .nav-btn--profile { background: var(--ink); color: var(--paper); }
    .nav-btn--profile:hover { background: var(--ink-2); }
    .hidden { display: none !important; }
  `
  el.prepend(style)

  el.querySelector('[data-action="home"]')!.addEventListener('click', () => {
    store.setState({ view: 'search', searchResult: null, error: null })
  })

  el.querySelector('[data-action="register"]')!.addEventListener('click', () => {
    store.setState({ view: 'register', error: null })
  })

  const profileBtn = el.querySelector('.nav-btn--profile') as HTMLElement
  const registerBtn = el.querySelector('[data-action="register"]') as HTMLElement

  el.querySelector('[data-action="profile"]')!.addEventListener('click', () => {
    store.setState({ view: 'profile', error: null })
  })

  store.subscribe(() => {
    const { user } = store.getState()
    if (user) {
      profileBtn.classList.remove('hidden')
      profileBtn.querySelector('.nav-btn__username')!.textContent = user.username
      registerBtn.classList.add('hidden')
    } else {
      profileBtn.classList.add('hidden')
      registerBtn.classList.remove('hidden')
    }
  })

  return el
}
