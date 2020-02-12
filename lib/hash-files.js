const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const md5File = require('md5-file');

const spinner = ora();

const getFileName = file => path.basename(file, path.extname(file));

const getHashName = file => {
  return `${getFileName(file)}.${md5File.sync(file)}${path.extname(file)}`;
};

const createHashFile = async file => {
  const dir = path.dirname(file);
  const hashedLocation = `${dir}/${getHashName(file)}`;
  const css = fs.readFileSync(file);
  try {
    await fs.outputFile(hashedLocation, css.toString());
    spinner.info(`Added: ${hashedLocation}`);
  } catch (err) {
    throw new Error(err.message);
  }
};

const arrayToObject = (arr, keyField, valueField) =>
  Object.assign(
    {},
    ...arr.map(item => ({ [item[keyField]]: item[valueField] }))
  );

const duplicates = arr => {
  const seen = new Set();
  const store = [];
  arr.filter(
    item =>
      seen.size === seen.add(item).size &&
      !store.includes(item) &&
      store.push(item)
  );
  return store;
};

module.exports = async (dirs, manifest) => {
  spinner.start('Hash CSS files');

  // create hashed files
  await Promise.all(dirs.map(file => createHashFile(file.out)));

  // create an array of files/hash files
  const hashArr = dirs.map(file => {
    return {
      file: getFileName(file.out),
      hash: getHashName(file.out),
    };
  });

  // check for duplicate file names
  const fileDuplicates = duplicates(hashArr.map(item => item.file));
  if (fileDuplicates.length > 0) {
    fileDuplicates.forEach(name => {
      spinner.fail(`Multiple files named "${name}" exist directory map. Rename one of them.`);
    });
    throw new Error('Manifest keys must be unique.');
  }

  // generate manifest of files {name: locations/name.hash.css}
  const hashObj = arrayToObject(hashArr, 'file', 'hash');

  try {
    await fs.outputFile(manifest, JSON.stringify(hashObj, null, 2));
  } catch (error) {
    throw new Error(error.message);
  }

  spinner.succeed();
};
