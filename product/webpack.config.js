const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({

  name: 'product', //unique name for the mfe

  //exposing the product component
  exposes: {
    './Component': './src/app/app.component.ts',
    // './ProductService':'./src/assets/groceries.service.ts'
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }), //single instace across all mfe's, version should match with the host, automatically detects the version from package.json
  },

});
