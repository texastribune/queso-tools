const ora = require('ora');
const fs = require('fs-extra');
const { isProductionEnv } = require('./env');
const { SCSS_SUCCESS } = require('./constants');
const compile = require('./compile');
const hashFiles = require('./hash-files');
const { getSize } = require('./utils');

const spinner = ora();

const processSass = async dirMap => {
  const file = dirMap.in;
  const { out } = dirMap;
  try {
    if (fs.existsSync(file)) {
      // compile scss
      let css = '';
      spinner.info(`Compiling ${file}`)
      try {
        css = await compile({
          isMin: isProductionEnv,
          outFile: out,
          sourceMapOn: !isProductionEnv,
          isAmp: false,
          file,
        });
      } catch (err) {
        throw new Error(err.formatted);
      }
      // write out compiled css specified output directory
      try {
        await fs.outputFile(out, css);
        const size = getSize(out);
        spinner.info(`Compiled: ${out}(${size}kb)`);
        if (css.length < 1) {
          spinner.warn(`No CSS output in: ${out}`);
        }
      } catch (err) {
        throw new Error(err.message);
      }

      // generate cache busted files
    } else {
      spinner.warn(`${file} does not exist.`);
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = async (dirs, manifest) => {
  spinner.start('Compile SCSS');
  await Promise.all(dirs.map(dirMap => processSass(dirMap)));
  spinner.succeed();

  // if manifest, assume hashed files are needed
  if (typeof manifest !== 'undefined') {
    await hashFiles(dirs, manifest);
  }

  return SCSS_SUCCESS;
};
