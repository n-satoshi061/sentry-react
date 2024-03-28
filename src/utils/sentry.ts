import * as Sentry from '@sentry/browser';
import Axios from 'axios';
import { isAxiosError } from './isAxiosError';

const SENTRY_DSN = process.env.SENTRY_DSN;
const RELEASE_TAG = process.env.RELEASE_TAG;
const ENVIRONMENT = process.env.ENVIRONMENT;
// MEMO: 今は検証のため本番環境でなくても動作させるが、実運用時は必要
// const ISPROD = isProd

let isSentryEnabled = false;

export function setupSentry() {
  if (SENTRY_DSN) {
    isSentryEnabled = true;
    Sentry.init({
      dsn: SENTRY_DSN,
      release: RELEASE_TAG,
      environment: ENVIRONMENT,
      normalizeDepth: 10,
      ignoreErrors: [
        'Request failed with status code 40',
        'Request failed with status code 50',
        'Network Error',
        'AutosizeInput, Select', // react-select
        'MenuPlacer', // react-select
        'DraggableCore', // react-draggable
        'NodeResolver',
        'Non-Error promise rejection captured with keys',
      ],
    });
  }
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