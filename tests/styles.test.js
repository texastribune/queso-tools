const fs = require('fs-extra');
const { styles } = require('../lib');
const { CSS_MAP, MANIFEST_FILE } = require('../examples/paths');
const { SCSS_SUCCESS } = require('../lib/constants');

it('Compiles SCSS', async () => {
  const data = await styles(CSS_MAP, MANIFEST_FILE);
  expect(data).toBe(SCSS_SUCCESS);
});

// update test.css if CSS output has intentionally changed
it('CSS is unchanged', async () => {
  const compiledPath = './dist/queso.css';
  const testPath = './tests/files/test.css';
  expect(fs.readFileSync(compiledPath)).toEqual(fs.readFileSync(testPath));
});
