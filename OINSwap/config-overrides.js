/**
 * Created by buddy on 2020-04-05.
 */

const path = require('path');
const { override, addWebpackAlias } = require('customize-cra');
const { addReactRefresh } = require('customize-cra-react-refresh');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve('src'),
  }),
  addReactRefresh({
    disableRefreshCheck: true,
  })
);
