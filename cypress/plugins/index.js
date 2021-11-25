// eslint-disable-next-line @typescript-eslint/no-var-requires
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on) => {
  on('file:preprocessor', cypressTypeScriptPreprocessor);

  on('task', {
    log(message) {
      console.log(message);

      return null;
    },
    table(message) {
      console.table(message);

      return null;
    },
  });
};
