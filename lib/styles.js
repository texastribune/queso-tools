// utility packages
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');

// css packages
const postCSS = require('postcss');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');

// internal
const { isProductionEnv } = require('./env');
const { bustCache, getBundles } = require('./utils');
const { SCSS_SUCCESS } = require('./constants');

const spinner = ora();

// postCSS plugins
// @todo: Add linting when further along in CSS cleanup.
const postCSSInstance = postCSS([autoprefixer({ grid: true })]);

const processSass = async (dirMap, oldBundles) => {
  // get input and output
  const filePath = dirMap.in;
  const outputPath = dirMap.out;
  const outputDir = path.dirname(outputPath);

  const bustedObj = bustCache(outputPath);
  const { baseName } = bustedObj;
  let { bustedName, bustedLocation } = bustedObj;

  // compile the sass file
  let compiled = {};
  const doShowSourceMaps = !isProductionEnv;
  try {
    compiled = await sass.renderSync({
      file: filePath,
      includePaths: ['node_modules', './node_modules'],
      outFile: bustedLocation,
      sourceComments: doShowSourceMaps,
      sourceMap: doShowSourceMaps,
      sourceMapEmbed: doShowSourceMaps,
    });
  } catch (err) {
    throw err;
  }

  // grab CSS of compiled object
  let { css } = compiled;

  // pass CSS through postcss plugins declared in postCSSInstance
  try {
    const processed = await postCSSInstance.process(css, {
      from: filePath,
    });
    css = processed.toString();
  } catch (err) {
    throw err;
  }

  // on prod (build), run our CSS through a cleaner
  if (isProductionEnv) {
    const cssCleaner = new CleanCSS({
      returnPromise: true,
      level: 2,
    });
    const { styles: minified } = await cssCleaner.minify(css);
    css = minified;
  }

  // check if this css is same as last
  if (typeof oldBundles[baseName] !== 'undefined') {
    try {
      const oldName = oldBundles[baseName];
      const oldLocation = `${outputDir}/${oldName}`;
      const oldVersion = await fs.readFileSync(oldLocation, 'utf8');
      if (oldVersion === css) {
        bustedName = oldName;
        bustedLocation = oldLocation;
      }
    } catch (err) {
      throw err;
    }
  }

  // write out compiled css or html to specified output directory
  try {
    await fs.outputFile(bustedLocation, css);
  } catch (err) {
    throw err;
  }

  const obj = {};
  obj[baseName] = bustedName;
  return obj;
};

const processManifest = async (bustedMap, manifest) => {
  const bustedMapObj = {};
  bustedMap.forEach(file => {
    bustedMapObj[Object.keys(file)] = file[Object.keys(file)];
  });
  try {
    await fs.outputFile(manifest, JSON.stringify(bustedMapObj, null, 2));
  } catch (err) {
    throw err;
  }
};

module.exports = async (dirs, manifest) => {
  spinner.start('Compiling SCSS');

  // first grab old bundle map for no-change events
  let oldBundles = {};
  try {
    oldBundles = await getBundles(manifest);
  } catch (error) {
    spinner.warn('No prior CSS bundles found.');
  }

  // loop through each file found and process our sass
  let bustedMap = [];
  try {
    bustedMap = await Promise.all(
      dirs.map(dirMap => processSass(dirMap, oldBundles))
    );
  } catch (error) {
    spinner.fail();
    throw new Error(error.message);
  }

  // write a manifest to locate files
  try {
    await processManifest(bustedMap, manifest);
  } catch (error) {
    spinner.fail();
    throw new Error(error.message);
  }

  spinner.succeed();
  return SCSS_SUCCESS;
};
