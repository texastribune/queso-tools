const fs = require('fs');
const path = require('path');
const ora = require('ora');
const CleanCSS = require('clean-css');
const amphtmlValidator = require('amphtml-validator');
const { logMessage } = require('./utils');
const { AMP_BOILERPLATE, AMP_SUCCESS } = require('./constants');

const spinner = ora();

const processAMP = async dirs => {
  // get css file contents
  let css = await fs.readFileSync(dirs.in);

  // minify css
  const cssCleaner = new CleanCSS({
    returnPromise: true,
  });
  const { styles: minified } = await cssCleaner.minify(css);
  css = minified;

  // prep for amp and html
  css = css.replace(/!important/g, '');
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
    fs.writeFileSync(dirs.out, css, 'utf-8');
    return {
      msg: `${path.basename(dirs.in)} built in ${path.basename(dirs.out)}`,
      full: `Full path: ${dirs.out}`,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = async dirs => {
  spinner.start('Building AMP styles');
  let resp = {};

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
