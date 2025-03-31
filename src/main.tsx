import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import * as Sentry from '@sentry/react'
import { FallbackComponent } from './components/FallbackComponent.tsx'
import { Router } from './Router.tsx'
import { initSentry } from './util/sentry.ts'

initSentry()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={
        <div>
          Sentry Fallback!
          <FallbackComponent />
        </div>
      }
      showDialog
    >
      <Router />
    </Sentry.ErrorBoundary>
  </React.StrictMode>
)
