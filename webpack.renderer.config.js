const rules = require('./webpack.rules');
const { VueLoaderPlugin } = require('vue-loader')

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});
rules.push({
    test: /\.ttf$/,
    use: [
        {
            loader: 'url-loader',
            options: {
                name: './font/[hash].[ext]',
            },
        },
    ]
})

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
  resolve: {
    extensions: ['.js', '.vue', '.json', '.wasm']
  },
  plugins: [
    // make sure to include the plugin!
    new VueLoaderPlugin()
  ],
  target: 'electron-renderer'
};
