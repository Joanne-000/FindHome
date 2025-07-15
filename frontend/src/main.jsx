import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import { UserProvider } from "./contexts/UserContext.jsx";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <UserProvider>
        <App />
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>

  </StrictMode>,
)
