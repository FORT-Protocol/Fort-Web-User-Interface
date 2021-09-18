const DynamicCdnWebpackPlugin = require('dynamic-cdn-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  webpack: {
    plugins: {
      add: [new DynamicCdnWebpackPlugin()],
    },
    configure: (webpackConfig) => {
      const instanceOfMiniCssExtractPlugin = webpackConfig.plugins.find(
        (plugin) => plugin instanceof MiniCssExtractPlugin
      )
      if (instanceOfMiniCssExtractPlugin) {
        instanceOfMiniCssExtractPlugin.options.ignoreOrder = true
      }

      return webpackConfig
    },
    babel: {
      plugins: ['lodash'],
    },
  },
}