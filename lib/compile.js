// eslint-disable-next-line import/no-extraneous-dependencies
const browserslist = require('browserslist');
const sass = require('sass');
const { transform, browserslistToTargets } = require("lightningcss");
const { logMessage } = require('./utils');


module.exports = async (config) => {
  // compile the sass file
  let compiled = {};
  const { isMin, sourceMapOn, file } = config;
  

  try {
    compiled = await sass.compile(file, {
      loadPaths: ['node_modules', './node_modules'],
      sourceMap: sourceMapOn,
      sourceMapIncludeSources: sourceMapOn,
      logger: sass.Logger.silent,
    });
  } catch (err) {
    logMessage(err, 'red');
    throw err;
  }

  // grab CSS of compiled object
  const { css, sourceMap } = compiled;
  

  const { code, map } = await transform({
    code: Buffer.from(css),
    minify: isMin,
    sourceMap: sourceMapOn,
    inputSourceMap: sourceMapOn ? JSON.stringify(sourceMap) : '',
    targets: browserslistToTargets(browserslist()),
  });

  if (sourceMapOn) {
    const smBase64 = (Buffer.from(map, 'utf8') || '').toString('base64')
    const smComment = `/*# sourceMappingURL=data:application/json;charset=utf-8;base64,${smBase64} */`;
    // append inline source map to compiled css
    return code.toString() + '\n'.repeat(2) + smComment;
  }
  return code;
};
