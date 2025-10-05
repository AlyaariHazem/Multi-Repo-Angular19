const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'cartModule.js',

  //exposing Cart component
  exposes: {
    './Component': './src/app/app.component.ts',
    './HomeModule':'./src/app/home/home.module',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

});
