// utility packages
const fs = require('fs-extra');
const ora = require('ora');

// internal
const { COPY_SUCCESS } = require('./constants');

const spinner = ora();

const copyDirs = async dirMap => {
  try {
    await /* TODO: JSFIX could not patch the breaking change:
    Allow copying broken symlinks 
    Suggested fix: You can use the exists and existsSync functions https://nodejs.org/api/fs.html#fsexistspath-callback from the fs module to check if a symlink is broken. */
    fs.copy(dirMap.in, dirMap.out, { preserveTimestamps: true });
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
