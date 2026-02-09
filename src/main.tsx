import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.scss'

if (import.meta.env.DEV) {
  const mockModules = import.meta.glob('./mock/*.ts', { eager: true })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
