const styles = require('../lib/styles');
const { CSS_MAP, MANIFEST_FILE } = require('../examples/paths');
const { SCSS_SUCCESS } = require('../lib/constants');

it('Compiles SCSS', async () => {
  const data = await styles(CSS_MAP, MANIFEST_FILE);
  expect(data).toBe(SCSS_SUCCESS);
});
