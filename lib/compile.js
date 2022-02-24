const postCSS = require('postcss');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postAMP = require('postcss-amp');
const CleanCSS = require('clean-css');
const { logMessage } = require('./utils');

let postCSSPlugins = [autoprefixer({ grid: true })];

module.exports = async config => {
  // compile the sass file
  let compiled = {};
  const { isAmp, isMin, outFile, sourceMapOn, file } = config;

  try {
    compiled = await sass.renderSync({
      file,
      outFile,
      includePaths: ['node_modules', './node_modules'],
      sourceComments: sourceMapOn,
      sourceMap: sourceMapOn,
      sourceMapEmbed: sourceMapOn,
      logger: sass.Logger.silent,
    });
  } catch (err) {
    logMessage(err, 'red');
    throw err;
  }

  // grab CSS of compiled object
  let { css } = compiled;

  // pass CSS through postcss plugins declared in postCSSInstance
  if (isAmp) {
    postCSSPlugins = [...postCSSPlugins, ...[postAMP]];
  }
  const postCSSInstance = postCSS(postCSSPlugins);
  try {
    const processed = await postCSSInstance.process(css, {
      from: file,
    });
    css = processed.toString();
  } catch (err) {
    logMessage(err, 'red');
    throw err;
  }

  // minify
  if (isMin || isAmp) {
    const cssCleaner = new CleanCSS({
      returnPromise: true,
      level: 2,
    });
    const { styles: minified } = await cssCleaner.minify(css);
    css = minified;
  }

  return css;
};
