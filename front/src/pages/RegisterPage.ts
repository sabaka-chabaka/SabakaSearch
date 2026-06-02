import { api, ApiError } from '../api/client'
import { store } from '../store/store'

export function RegisterPage(): HTMLElement {
  const el = document.createElement('div')
  el.className = 'register-page'

  const style = document.createElement('style')
  style.textContent = `
    .register-page {
      max-width: 900px;
      margin: 0 auto;
      padding: 3rem 1.5rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: start;
    }
    .register-promo {}
    .register-promo__eyebrow {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 1rem;
    }
    .register-promo__title {
      font-family: var(--font-serif);
      font-size: clamp(2rem, 4vw, 3rem);
      font-style: italic;
      line-height: 1.15;
      margin-bottom: 1.5rem;
    }
    .register-promo__title em {
      color: var(--accent);
      font-style: normal;
    }
    .register-promo__desc {
      font-size: 14px;
      color: var(--ink-2);
      line-height: 1.7;
    }
    .register-perks {
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .register-perk {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 13px;
      color: var(--ink-2);
    }
    .register-perk__dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
      flex-shrink: 0;
      margin-top: 6px;
    }
    .register-form-wrap {
      border: var(--border);
      padding: 2rem;
      border-radius: var(--radius);
      background: var(--paper);
    }
    .register-form-title {
      font-size: 15px;
      font-weight: 600;
      margin-bottom: 1.5rem;
      letter-spacing: 0.01em;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-label {
      display: block;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--ink-3);
      margin-bottom: 6px;
    }
    .form-input {
      width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      font-family: var(--font-mono);
      border: var(--border);
      border-radius: var(--radius);
      background: var(--paper);
      color: var(--ink);
      outline: none;
      transition: border-color var(--transition);
    }
    .form-input:focus {
      border-color: var(--accent);
    }
    .form-input::placeholder { color: var(--ink-3); }
    .form-submit {
      width: 100%;
      margin-top: 1.25rem;
      padding: 12px;
      background: var(--ink);
      color: var(--paper);
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      border-radius: var(--radius);
      transition: background var(--transition);
    }
    .form-submit:hover { background: var(--accent); }
    .form-submit:disabled { opacity: 0.5; cursor: not-allowed; }
    .form-error {
      margin-top: 1rem;
      padding: 10px 14px;
      background: var(--accent-dim);
      border-left: 3px solid var(--accent);
      font-size: 13px;
      color: var(--accent);
      font-family: var(--font-mono);
    }
    .form-success {
      margin-top: 1rem;
      padding: 10px 14px;
      background: #e6f4ea;
      border-left: 3px solid #2e7d32;
      font-size: 13px;
      color: #2e7d32;
      font-family: var(--font-mono);
    }
    .already-link {
      margin-top: 1rem;
      text-align: center;
      font-size: 12px;
      color: var(--ink-3);
    }
    .already-link button {
      color: var(--accent);
      font-size: 12px;
      text-decoration: underline;
    }
    @media (max-width: 640px) {
      .register-page {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 1.5rem 1rem;
      }
    }
  `
  el.prepend(style)

  el.innerHTML += `
    <div class="register-promo">
      <p class="register-promo__eyebrow">SabakaSearch</p>
      <h2 class="register-promo__title">История поисков<br><em>всегда с тобой</em></h2>
      <p class="register-promo__desc">
        Зарегистрируйся и каждый поисковый запрос будет привязан к твоему профилю.
        Смотри историю, возвращайся к нужным результатам.
      </p>
      <ul class="register-perks">
        <li class="register-perk"><span class="register-perk__dot"></span>Полная история запросов</li>
        <li class="register-perk"><span class="register-perk__dot"></span>Персонализированные результаты</li>
        <li class="register-perk"><span class="register-perk__dot"></span>Кеш работает для тебя</li>
      </ul>
    </div>
    <div class="register-form-wrap">
      <p class="register-form-title">Создать аккаунт</p>
      <form id="reg-form">
        <div class="form-group">
          <label class="form-label" for="reg-username">Имя пользователя</label>
          <input class="form-input" id="reg-username" type="text" placeholder="sabaka42" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-email">Email</label>
          <input class="form-input" id="reg-email" type="email" placeholder="woof@example.com" required autocomplete="email" />
        </div>
        <div class="form-group">
          <label class="form-label" for="reg-password">Пароль</label>
          <input class="form-input" id="reg-password" type="password" placeholder="••••••••" required autocomplete="new-password" />
        </div>
        <button class="form-submit" type="submit" id="reg-btn">Зарегистрироваться</button>
        <div id="reg-feedback"></div>
      </form>
      <p class="already-link">
        Уже есть аккаунт? <button id="go-search">Назад к поиску</button>
      </p>
    </div>
  `

  const form = el.querySelector('#reg-form') as HTMLFormElement
  const btn = el.querySelector('#reg-btn') as HTMLButtonElement
  const feedback = el.querySelector('#reg-feedback') as HTMLElement

  el.querySelector('#go-search')!.addEventListener('click', () => {
    store.setState({ view: 'search', error: null })
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    btn.disabled = true
    feedback.innerHTML = ''

    const username = (el.querySelector('#reg-username') as HTMLInputElement).value.trim()
    const email = (el.querySelector('#reg-email') as HTMLInputElement).value.trim()
    const password = (el.querySelector('#reg-password') as HTMLInputElement).value

    try {
      const user = await api.users.register({ username, email, password })
      store.setState({ user, view: 'profile' })
    } catch (err) {
      const msg = err instanceof ApiError ? err.body.error : 'Ошибка регистрации'
      feedback.innerHTML = `<div class="form-error">${msg}</div>`
      btn.disabled = false
    }
  })

  return el
}
