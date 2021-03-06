const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const amphtmlValidator = require('amphtml-validator');
const compile = require('./compile');
const { logMessage, getSize } = require('./utils');
const { AMP_BOILERPLATE, AMP_SUCCESS } = require('./constants');

const spinner = ora();

const processAMP = async dirs => {
  // compile SCSS with isAMP set to true
  let css = await compile({
    isAmp: true,
    outFile: dirs.out,
    sourceMapOn: false,
    file: dirs.in,
  });
  css = `<style amp-custom>${css}</style>`;

  // run a validation check
  const html = AMP_BOILERPLATE.replace('{{injectAMP}}', css);
  const validator = await amphtmlValidator.getInstance();
  let resp = {};
  try {
    resp = validator.validateString(html);
  } catch (error) {
    throw error;
  }
  if (resp.status !== 'PASS') {
    spinner.fail();
    logMessage(
      `AMP Validation failed for ${path.basename(
        dirs.in
      )}. See below for details:`,
      'red'
    );
    // eslint-disable-next-line no-console
    console.error(resp);
    throw resp;
  }

  // write out CSS to specified output directory
  try {
    await fs.outputFile(dirs.out, css, 'utf-8');
    const size = getSize(dirs.out);
    return {
      msg: `${path.basename(dirs.in)} built in ${path.basename(
        dirs.out
      )}(${size}kb)`,
      full: `Full path: ${dirs.out}`,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = async dirs => {
  spinner.start('Build AMP styles');
  let resp = [];

  try {
    resp = await Promise.all(dirs.map(dirMap => processAMP(dirMap)));
  } catch (error) {
    spinner.fail();
    throw new Error(error.message);
  }

  spinner.succeed();

  // log each outputted AMP file for easy reference
  resp.forEach(log => {
    spinner.info(log.msg);
    spinner.info(log.full);
  });

  return AMP_SUCCESS;
};
