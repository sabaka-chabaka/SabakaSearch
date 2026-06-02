import './style.css'
import { Header } from './components/Header'
import { SearchPage } from './pages/SearchPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProfilePage } from './pages/ProfilePage'
import { store } from './store/store'
import type { View } from './store/store'

const app = document.getElementById('app')!

const header = Header()
app.appendChild(header)

const main = document.createElement('main')
main.style.flex = '1'
app.appendChild(main)

function renderView(view: View) {
    main.innerHTML = ''
    switch (view) {
        case 'search':
            main.appendChild(SearchPage())
            break
        case 'register':
            main.appendChild(RegisterPage())
            break
        case 'profile':
            main.appendChild(ProfilePage())
            break
    }
}

renderView(store.getState().view)

store.subscribe(() => {
    const { view } = store.getState()
    renderView(view)
})