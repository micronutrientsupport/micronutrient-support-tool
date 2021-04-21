const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = on => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  on('file:preprocessor', cypressTypeScriptPreprocessor);
};
