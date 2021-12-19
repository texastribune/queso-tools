const fs = require('fs-extra');
const { icons } = require('../lib');
const { SVG_MAP } = require('../examples/paths');
const { SVG_SUCCESS } = require('../lib/constants');

it('Builds icons', async () => {
  const data = await icons(SVG_MAP);
  data.forEach(msg => {
    expect(msg).toBe(SVG_SUCCESS);
  });
});

// update test.svg if SVG output has intentionally changed
it('SVG sprite is unchanged', async () => {
  const compiledPath = './dist/icons-dir.html';
  const testPath = './tests/files/test.svg';
  expect(fs.readFileSync(compiledPath)).toEqual(fs.readFileSync(testPath));
});