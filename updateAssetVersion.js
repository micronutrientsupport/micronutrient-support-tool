const fs = require('fs');
const version = require('./package.json').version;
console.log(version);

const json = {
  version: version,
};

fs.writeFileSync('./src/assets/version.json', JSON.stringify(json));
