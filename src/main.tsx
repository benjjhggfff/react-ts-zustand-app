import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/iconfont/font_5117717_hinyt307z39/iconfont.csss'; 
import App from './App.tsx'
import './index.scss'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
