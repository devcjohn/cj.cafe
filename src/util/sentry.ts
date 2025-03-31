import * as Sentry from '@sentry/react'

export const initSentry = () =>
  Sentry.init({
    environment: import.meta.env.MODE, // import.meta.env.MODE === 'development' or 'production'
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({
        // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      }),
      Sentry.replayIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Turn this down later, if needed
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    beforeSend(event, hint) {
      // Check if it is an exception, and if so, show the report dialog (unless in development)
      if (event.exception && import.meta.env.MODE !== 'development') {
        Sentry.showReportDialog({
          eventId: event.event_id,
          user: {
            email: 'NoneOfYourBeeswax@example.com',
          },
          hint,
        })
      }
      return event
    },
  })
