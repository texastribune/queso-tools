const fs = require('fs-extra');
const path = require('path');


const bustCache = (file) => {
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const bustedName = `${baseName}.${Date.now()}${ext}`;
  const bustedLocation = `${path.dirname(file)}/${bustedName}`;
  return {
    baseName,
    bustedName,
    bustedLocation,
  };
};

const getBundles = mapLocation => fs.readJson(mapLocation);

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}


module.exports = {
  bustCache,
  getBundles,
  resolveApp,
};
