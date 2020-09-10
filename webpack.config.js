const getWebpackConfig = require('yuso-tools/lib/getWebpackConfig');
const pkg = require('./package.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const webpackConfig = getWebpackConfig(false);

webpackConfig.forEach((config, index) => {
  if (index === 0) {

    config.plugins.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: `../analysis/${pkg.name}@${pkg.version}.html`,
    }))
  }
});

module.exports = webpackConfig;