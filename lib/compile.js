const postCSS = require('postcss');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const CleanCSS = require('clean-css');
const { logMessage } = require('./utils');

const postCSSPlugins = [autoprefixer({ grid: true })];

module.exports = async config => {
  // compile the sass file
  let compiled = {};
  const { isMin, outFile, sourceMapOn, file } = config;

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
  if (isMin) {
    const cssCleaner = new CleanCSS({
      returnPromise: true,
      level: 2,
    });
    const { styles: minified } = await cssCleaner.minify(css);
    css = minified;
  }

  return css;
};
