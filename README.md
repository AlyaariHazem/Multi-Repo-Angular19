Multi-Repo-Angular19

Microfrontend application for managing company modules, built with Angular 19, Module Federation, and a multi-repo layout.

Repos/dirs in this monorepo:

shell/ – host app (router, layout, shared auth/guards)

product/ – remote MFE (Products)

cart/ – remote MFE (Cart)

✨ Features

Angular 19 + Standalone/NgModules hybrid

Webpack Module Federation with @angular-architects/module-federation

Local/Server URL resolver with automatic remoteEntry.js handling

SCSS styling (optional; instructions below)

PrimeNG/Bootstrap ready

Route composition from host with per-feature child routes

📦 Tech Stack

Angular 19

Webpack 5, Module Federation

@angular-architects/module-federation

ngx-build-plus (where used)

TypeScript

🗂️ Repo Structure
/
├── shell/                      # Host application
│   ├── src/
│   ├── angular.json
│   └── webpack.config.js
├── product/                    # Remote: products
│   ├── src/
│   ├── angular.json
│   └── webpack.config.js
├── cart/                       # Remote: cart
│   ├── src/
│   ├── angular.json
│   └── webpack.config.js
└── README.md

🔧 Prerequisites

Node.js 18+ (recommended LTS)

npm 9+ (or pnpm/yarn if you prefer)

Git

🚀 Getting Started (Local Dev)

Each app is an independent Angular project. Install & run inside each folder.

Install dependencies

# from repo root
cd shell && npm i
cd ../product && npm i
cd ../cart && npm i


Start the remotes first, then the shell

Default (example) ports used in this repo:

product: 4201

cart: 4202 (or 4203 in some setups)

shell: 4200

# terminal 1
cd product
npm start    # serves on http://localhost:4201

# terminal 2
cd cart
npm start    # serves on http://localhost:4202  (adjust if your config is 4203)

# terminal 3
cd shell
npm start    # serves on http://localhost:4200


If your remote uses a different port, update it in the environment or localDevPorts mapping in the URL resolver (see “URL Resolution” below).

🧩 Module Federation
Remote exposes (example)

product/webpack.config.js

const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'products',
  exposes: {
    './Component': './src/app/app.component.ts',
    './HomeModule': './src/app/home/home.module.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});


cart/webpack.config.js

module.exports = withModuleFederationPlugin({
  name: 'cart',
  exposes: {
    './Component': './src/app/app.component.ts',
    './HomeModule': './src/app/home/home.module.ts',
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});

Shell consumption

Use loadRemoteModule and always point to remoteEntry.js:

import { loadRemoteModule } from '@angular-architects/module-federation';
import { getRemoteUrl, RemoteApps } from 'src/environments/env-remotes-resolver';

const productsRemote = getRemoteUrl(RemoteApps.products, 'remoteEntry.js');

{
  path: 'products/modules',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: productsRemote,
      exposedModule: './HomeModule',
    }).then(m => m.HomeModule),
}

🌐 URL Resolution (Local vs Server)

We use a resolver like:

// getRemoteUrl(app, 'remoteEntry.js')
//
// - If running on localhost and env points to localhost, use that.
// - Otherwise, if localhost but no env URL, use localhost:<port> for the app.
// - On a real domain, generate: https://<subdomain>.<root-domain>/remoteEntry.js


Important: Do not point to cartModule.js or similar. Hosts must load the federation container: remoteEntry.js.

If you saw URLs like http://cart-remote.localhost:4203/..., the resolver has been fixed to avoid subdomains on localhost. On localhost it should use http://localhost:<port>/remoteEntry.js.

🧭 Routing Guidelines

The shell owns the top-level routes (e.g. /products, /cart, /workflow, etc.).

Each remote should not repeat its own prefix; it should expose child routes starting at '' → modules, etc.

Example remote routes:

// remote: src/app/app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'modules', pathMatch: 'full' },
  { path: 'modules', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
];


Example shell composition (child routes under a layout with <router-outlet>):

{
  path: 'cart',
  component: HelpdeskLayoutComponent, // must contain <router-outlet>
  children: [
    {
      path: '',
      loadChildren: () =>
        loadRemoteModule({
          type: 'module',
          remoteEntry: getRemoteUrl(RemoteApps.cart, 'remoteEntry.js'),
          exposedModule: './HomeModule',
        }).then(m => m.HomeModule),
    },
  ],
}

🎨 Switch to SCSS (optional but recommended)

Install Sass

npm i -D sass


Update angular.json in each project:

Set "styles": ["src/styles.scss"]

Optionally set default style for new components:

"schematics": { "@schematics/angular:component": { "style": "scss" } }


Rename:

src/styles.css → src/styles.scss

*.component.css → *.component.scss

Update styleUrls to .scss

🧪 Scripts (typical)

From inside each project folder:

npm start      # dev server
npm run build  # production build
npm test       # unit tests (if configured)

🛠 Troubleshooting

404 for remoteEntry.js
Make sure the remote is running on the expected port and getRemoteUrl(RemoteApps.X, 'remoteEntry.js') matches it.

Can’t find exposed module ./HomeModule
Check the remote’s webpack.config.js exposes path and file name (e.g., ./src/app/home/home.module.ts). Ensure HomeModule is exported.

Blank page under a layout
Verify the layout component’s template has <router-outlet>.

Subdomain on localhost
Resolver should not prepend subdomains when hostname is localhost. Use the updated resolver that picks http://localhost:<port>.

🔐 Auth / Guards

Shell ships with AuthenticatedGuard (example). Ensure it’s provided and applied where needed. If a route doesn’t render, confirm the guard isn’t blocking.

📦 Build & Deploy (prod)

Build each remote:

cd product && npm run build
cd ../cart && npm run build


Host the build artifacts (e.g., Nginx or static hosting).
Ensure the remoteEntry.js files are reachable at the expected subdomains/paths in production.

Build the shell:

cd ../shell && npm run build


Deploy shell to your main domain; remotes to their subdomains or CDN paths per your resolver rules.

📜 License

Private repository – internal use only.

🤝 Contributing

Create feature branches from main.

Use conventional commit messages where possible.

Open a PR with a clear description and testing steps.
