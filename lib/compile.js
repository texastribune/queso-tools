const sass = require('sass');
const { transform } = require("lightningcss");
const { logMessage } = require('./utils');


module.exports = async (config) => {
  // compile the sass file
  let compiled = {};
  const { isMin, outFile, sourceMapOn, file } = config;

  try {
    compiled = await sass.compile(file, {
      outFile,
      loadPaths: ['node_modules', './node_modules'],
      sourceMap: sourceMapOn,
      sourceMapEmbed: sourceMapOn,
      sourceMapContents: sourceMapOn,
      logger: sass.Logger.silent,
    });
  } catch (err) {
    logMessage(err, 'red');
    throw err;
  }

  // grab CSS of compiled object
  const { css } = compiled;

  const { code } = await transform({
    code: Buffer.from(css),
    minify: isMin,
    sourceMap: sourceMapOn,
  });

  return code;
};
