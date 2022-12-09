const path = require('path');

module.exports = {
  //...
  resolve: {
    alias: {
        '@Applications': path.resolve(__dirname, 'src/apps/'),
    },
  },
};
