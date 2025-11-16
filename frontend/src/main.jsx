import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import StoreContenxtProvider from './context/StoreContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <StoreContenxtProvider>
        <App />
      </StoreContenxtProvider>
    </BrowserRouter>
  </StrictMode>,
)
