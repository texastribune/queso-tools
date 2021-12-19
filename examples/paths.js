const path = require('path');
const { resolveApp } = require('../lib/utils');

const inputPath = file => resolveApp(path.join('examples', 'assets', file));
const outputPath = file => resolveApp(path.join('dist', file));

const AMP_MAP = [
  {
    in: inputPath('sample.scss'),
    out: outputPath('amp-styles.html'),
  },
  {
    in: inputPath('queso.scss'),
    out: outputPath('queso-amp-styles.html'),
  },
];

const CSS_MAP = [
  {
    in: inputPath('sample.scss'),
    out: outputPath('sample.css'),
  },
  {
    in: inputPath('queso.scss'),
    out: outputPath('queso.css'),
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

const COPY_MAP = [
  {
    in: inputPath('bug.svg'),
    out: outputPath('copied-file/bug.svg'),
  },
  {
    in: inputPath('icons'),
    out: outputPath('copied-dir/icons'),
  },
];

const MANIFEST_FILE = outputPath('styles.json');

module.exports = {
  AMP_MAP,
  CSS_MAP,
  SVG_MAP,
  MANIFEST_FILE,
  COPY_MAP,
};
