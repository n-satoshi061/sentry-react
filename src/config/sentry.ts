import * as Sentry from '@sentry/browser';
import Axios from 'axios';
import { isAxiosError } from '../utils/isAxiosError';

const SENTRY_DSN = process.env.SENTRY_DSN;
const RELEASE_TAG = process.env.RELEASE_TAG;
const ENVIRONMENT = process.env.ENVIRONMENT;
// MEMO: 今は検証のため本番環境でなくても動作させるが、実運用時は必要
// const ISPROD = isProd

let isSentryEnabled = false;

export function setupSentry() {
  Sentry.init({
    dsn: "https://fd18d33c4756ec6339455060a4cb4236@o4506977155940352.ingest.us.sentry.io/4506977268662272",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

export const sentrySetUser = (userId: string, teamId: string) => {
    if (isSentryEnabled) {
      Sentry.setUser({ userId, teamId, host: window.location.host });
    }
  }

export const sentryLog = (err: any) => {
  

    if (!isSentryEnabled) return;
  
    if (Axios.isCancel(err)) return;
  
    if (isAxiosError(err)) {
      let contexts = {};
      const response = err.response;
      const endpoint = response?.config.url || '';
      const status = response?.status;
      const method = response?.config.method || '';
  
      contexts = { response };
  
      Sentry.withScope((scope) => {
        scope.setFingerprint(['{{ default }}', endpoint, String(status), method]);
        Sentry.captureException(err, {
          contexts,
        });
      });
    } else {
      Sentry.captureException(err);
    }
}