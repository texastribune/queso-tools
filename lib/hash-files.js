const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');

const spinner = ora();

const hasChanged = (dirMap, oldManifest) => {
    const { out } = dirMap;
    const ext = path.extname(out);
    const baseName = path.basename(out, ext);

    if (typeof oldManifest[baseName] !== 'undefined') {
      const bustedLocation = `${path.dirname(out)}/${oldManifest[baseName]}`;
      const oldCSS = fs.readFileSync(bustedLocation);
      const newCSS = fs.readFileSync(out);
      return oldCSS.toString() !== newCSS.toString();
    }
    return true; 
}

const createManifest = async (oldManifest, hasMap, manifest) => {
  const hashMapObj = {};
  hasMap.forEach(file => {
    hashMapObj[file.baseName] = file.bustedName;
  });
  const merged = { ...oldManifest, ...hashMapObj };
  try {
    await fs.outputFile(manifest, JSON.stringify(merged, null, 2));
  } catch (err) {
    throw err;
  }
};

const createHashFile = async(hashObj) => {
  const css = fs.readFileSync(hashObj.rawLocation);
  try {
    await fs.outputFile(hashObj.bustedLocation, css.toString());
    spinner.info(
      `Added: ${hashObj.bustedLocation}`
    );
  } catch (err) {
    throw new Error(err.message);
  }
}

const createHashObj = file => {
  const ext = path.extname(file);
  const baseName = path.basename(file, ext);
  const bustedName = `${baseName}.${Date.now()}${ext}`;
  const bustedLocation = `${path.dirname(file)}/${bustedName}`;
  const rawLocation = `${path.dirname(file)}/${baseName}${ext}`;
  return {
    baseName,
    bustedName,
    bustedLocation,
    rawLocation,
  };
};

module.exports = async (dirs, manifest) => {
  spinner.start('Hash CSS files');

  // get old manifest map for diffing files
  let oldManifest = {};
  try {
    oldManifest = await fs.readJson(manifest);
  } catch (error) {
    spinner.info(`No styles manifest found in: ${manifest}`);
    spinner.info(`Generating a new one...`);
  }

  // get changed files
  const changedFiles = await Promise.all(
    dirs.filter(dirMap => hasChanged(dirMap, oldManifest))
  );
  
  // generate array of hash info
  const newHashes = changedFiles.map(dirMap => createHashObj(dirMap.out));

  // create new/updated files
  await Promise.all(newHashes.map(file => createHashFile(file)));

  // write a manifest of files {name: locations/name.hash.css}
  try {
    await createManifest(oldManifest, newHashes, manifest);
  } catch (error) {
    throw new Error(error.message);
  }

  spinner.succeed()
}