// utility packages
const fs = require('fs-extra');
const ora = require('ora');

// internal
const { COPY_SUCCESS } = require('./constants');

const spinner = ora();

const copyDirs = async dirMap => {
  try {
    await fs.copy(dirMap.in, dirMap.out, { preserveTimestamps: true });
  } catch (err) {
    spinner.warn(
      'Copying assets: Note that if input is a file, output cannot be a directory.'
    );
    throw err
  }
  return COPY_SUCCESS;
};

module.exports = async dirs => {
  spinner.start('Copying assets');

  return Promise.all(dirs.map(dirMap => copyDirs(dirMap)))
    .then(resp => {
      spinner.succeed();
      return resp;
    })
    .catch(error => {
      spinner.fail();
      throw new Error(error.message);
    });
};
