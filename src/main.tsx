import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

try {
  const storedTheme = localStorage.getItem('aikyam-theme')
  const theme = storedTheme === 'light' ? 'light' : 'dark'
  document.documentElement.classList.add(theme)
  document.documentElement.setAttribute('data-theme', theme)
} catch {
  document.documentElement.classList.add('dark')
  document.documentElement.setAttribute('data-theme', 'dark')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
