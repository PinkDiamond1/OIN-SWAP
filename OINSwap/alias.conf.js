// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, './'),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      '@actions': path.resolve(__dirname, 'src/actions'),
      '@apis': path.resolve(__dirname, 'src/apis'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@reducers': path.resolve(__dirname, 'src/reducers'),
      '@utils': path.resolve(__dirname, 'src/utils'),
    },
  },
};
