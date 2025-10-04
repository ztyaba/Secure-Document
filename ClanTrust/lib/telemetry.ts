export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    console.info('Sentry disabled');
    return;
  }
  console.info('Sentry initialized (stub)');
}

export function logMetric(name: string, value: number) {
  console.info(`[metric] ${name}=${value}`);
}
