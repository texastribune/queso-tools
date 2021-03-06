const fs = require('fs-extra');
const path = require('path');

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

const logMessage = (msg, color) => {
  const message = msg != null && msg.message;
  let colorValue;
  switch (color) {
    case 'red':
      colorValue = '\x1b[31m%s\x1b[0m';
      break;
    case 'green':
      colorValue = '\x1b[32m%s\x1b[0m';
      break;
    case 'purple':
      colorValue = '\x1b[35m%s\x1b[0m';
      break;
    default:
      colorValue = '\x1b[37m%s\x1b[0m';
      break;
  }

  // eslint-disable-next-line no-console
  console.log(colorValue, `${message || msg}\n`);
};

const getSize = filename => {
  const stats = fs.statSync(filename);
  const { size } = stats;
  return size / 1000;
};

module.exports = {
  resolveApp,
  logMessage,
  getSize,
};
