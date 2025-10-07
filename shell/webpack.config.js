// shell/webpack.config.js
const { withModuleFederationPlugin, share } =
  require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'shell',
  // keep it dynamic-ready later if you want
  remotes: { },
  shared: share({
    '@angular/core':   { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/common': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    '@angular/router': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
    'rxjs':            { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  }),
});
