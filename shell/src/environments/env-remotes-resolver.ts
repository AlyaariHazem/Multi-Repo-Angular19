import { envRemotesVersions } from './env-remotes-versions';
import { environment } from './environment';

export enum RemoteApps {
  cart = 'cart',
  products = 'products',
}

const subdomainRemoteApps: Record<RemoteApps, string> = {
  cart: 'cart-remote',
  products: 'products-remote',
};

function isLocalHostName(hostname: string): boolean {
  return (
    hostname.includes('localhost') ||
    hostname.startsWith('127.') ||
    hostname.endsWith('.local')
  );
}

function ensureNoTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

/**
 * Optional: map local dev ports per remote.
 * If you don't want this, just omit and we'll fallback to the shell's host:port.
 */
const localDevPorts: Partial<Record<RemoteApps, number>> = {
  cart: 4202,       // change to your cart remote port
  products: 4201,   // change to your products remote port
};

export function getRemoteUrl(app: RemoteApps, path?: string): string {
  debugger;
  const envUrl = (environment as any)[app + 'ModuleUrl'] as string | undefined;
  const runningLocal = isLocalHostName(window.location.hostname);
  const file = path ?? `${app}Module.js`;

  // 1) If running locally AND envUrl is a localhost URL, prefer it
  if (
    runningLocal &&
    envUrl &&
    /^(https?:)?\/\/(localhost|127\.0\.0\.1)/i.test(envUrl)
  ) {
    const base = ensureNoTrailingSlash(envUrl);
    const finalUrl = `${base}/${file}`;
    console.log('[getRemoteUrl:local-env]', { app, envUrl: base, finalUrl });
    return finalUrl;
  }

  // 2) Derive a base host
  const fallbackHost = envRemotesVersions.customHost || window.location.host; // may include port
  const firstDot = fallbackHost.indexOf('.');
  const rootHost = firstDot > 0 ? fallbackHost.slice(firstDot + 1) : fallbackHost;

  // 3) LOCAL DEV: never add a subdomain on localhost. Use localhost[:port].
  if (isLocalHostName(rootHost) || runningLocal) {
    const port = localDevPorts[app]; // optional mapping
    const host = port ? `localhost:${port}` : rootHost; // fallback to current host:port
    const localUrl = `http://${host}/${file}`;
    console.log('[getRemoteUrl:local-derived]', { app, host, localUrl });
    return localUrl;
  }

  // 4) SERVER: add subdomain and use https
  const baseHostClean = rootHost.replace(
    new RegExp(`^${subdomainRemoteApps[app]}\\.`),
    ''
  );
  const remoteUrl = `https://${subdomainRemoteApps[app]}.${baseHostClean}/${file}`;

  console.log('[getRemoteUrl:server]', {
    app,
    envUrl,
    customHost: envRemotesVersions.customHost,
    rootHost,
    remoteUrl,
  });

  return remoteUrl;
}
