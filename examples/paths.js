const path = require('path');
const { resolveApp } = require('../lib/utils');

const inputPath = file => resolveApp(path.join('examples', 'assets', file));
const outputPath = file => resolveApp(path.join('dist', file));

const AMP_MAP = [
  {
    in: outputPath('sample.css'),
    out: outputPath('amp-styles.html'),
  },
];

const CSS_MAP = [
  {
    in: inputPath('sample.scss'),
    out: outputPath('sample.css'),
  },
];

const SVG_MAP = [
  {
    in: [inputPath('bug.svg')],
    out: outputPath('icons.html'),
  },
  {
    in: inputPath('icons'),
    out: outputPath('icons-dir.html'),
  },
];

const MANIFEST_FILE = outputPath('styles.json');

module.exports = {
  AMP_MAP,
  CSS_MAP,
  SVG_MAP,
  MANIFEST_FILE,
};
