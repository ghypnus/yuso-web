const req = require.context('./src', true, /^\.\/[^_][\w-]+\/style\/index\.less?$/);
req.keys().forEach((mod) => {
  req(mod);
});

module.exports = require('./src/index');
