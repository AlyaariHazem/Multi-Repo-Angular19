# Multi-Repo Angular 19 (Module Federation)

A minimal **micro‑frontend** setup with three apps:

- **shell/** – host application (router/layout)
- **product/** – remote MFE
- **cart/** – remote MFE

Works locally (localhost ports) and in prod (subdomains) using a small URL resolver that always loads **`remoteEntry.js`**.

---

## 1) Prerequisites

- Node.js **18+**
- npm **9+** (or pnpm/yarn)

---

## 2) Install

From repo root, install each app:

```bash
cd shell && npm i
cd ../product && npm i
cd ../cart && npm i
```

---

## 3) Run (Local Development)

> Start **remotes first**, then the **shell**.

Default dev ports (change if your config differs):

- **product** → http://localhost:4201
- **cart** → http://localhost:4202
- **shell** → http://localhost:4203

```bash
# terminal 1
cd product && npm start

# terminal 2
cd cart && npm start

# terminal 3
cd shell && npm start
```

Open: **http://localhost:4203**

---

## 4) Module Federation (What’s exposed)

**product/webpack.config.js**
```js
exposes: {
  './Component': './src/app/app.component.ts',
  './HomeModule': './src/app/home/home.module.ts'
}
```

**cart/webpack.config.js**
```js
exposes: {
  './Component': './src/app/app.component.ts',
  './HomeModule': './src/app/home/home.module.ts'
}
```

> Ensure the file paths exist and the modules are exported.

---

## 5) How the Shell loads remotes

Always load the **federation container** (`remoteEntry.js`) with `loadRemoteModule`:

```ts
import { loadRemoteModule } from '@angular-architects/module-federation';
import { getRemoteUrl, RemoteApps } from 'src/environments/env-remotes-resolver';

const productsRemote = getRemoteUrl(RemoteApps.products, 'remoteEntry.js');

export const routes = [
  {
    path: 'products/modules',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: productsRemote,
        exposedModule: './HomeModule',
      }).then(m => m.HomeModule),
  },
];
```

**Why `remoteEntry.js`?**  
It’s the MF container (manifest). Loading plain chunks like `productsModule.js` won’t register exposes or shared libs.

---

## 6) URL Resolver (Local vs Prod)

- On **localhost**, the resolver returns `http://localhost:<port>/remoteEntry.js`.
- On **prod**, it returns `https://<subdomain>.<root-domain>/remoteEntry.js`.
- No subdomain is added on localhost (avoids `cart-remote.localhost:4202`).

If your local ports differ, update the `localDevPorts` map in `env-remotes-resolver.ts`.

---

## 7) Routing Rules (keep it simple)

- The **shell** owns top-level paths (`/products`, `/cart`, …).
- Remotes should **not** repeat their own prefix.
- Typical remote routes:

```ts
// remote: src/app/app.routes.ts
export const routes = [
  { path: '', redirectTo: 'modules', pathMatch: 'full' },
  { path: 'modules', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
];
```

- Layout components used as route parents **must** include `<router-outlet>`.

---

## 8) Switch to SCSS (optional)

```bash
npm i -D sass
```

In each app’s `angular.json`:

- `"styles": ["src/styles.scss"]`
- (optional) `"schematics": { "@schematics/angular:component": { "style": "scss" } }`

Rename:

- `src/styles.css` → `src/styles.scss`
- `*.component.css` → `*.component.scss`
- update `styleUrls` accordingly.

---

## 9) Build

```bash
# in product
npm run build
# in cart
npm run build
# in shell
npm run build
```

Deploy **remotes** so their `remoteEntry.js` is publicly reachable, then deploy **shell**.

---

## 10) Common Issues (quick fixes)

- **404 for `remoteEntry.js`**  
  Remote not running or wrong port/URL. Fix port or resolver.

- **“Cannot find module './HomeModule'”**  
  Check `exposes` path and export name in remote webpack config.

- **Blank page under a layout**  
  Parent component missing `<router-outlet>` or a guard blocks the route.

---

## Scripts (typical)

Inside each app:

```bash
npm start      # dev server
npm run build  # production build
npm test       # if configured
```

---

## License

MIT License

Copyright (c) 2025 AlyaariHazem

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
