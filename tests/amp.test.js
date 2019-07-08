const { amp, styles } = require('../lib');
const { AMP_MAP, CSS_MAP, MANIFEST_FILE } = require('../examples/paths');
const { AMP_SUCCESS } = require('../lib/constants');

it('Builds and validates AMP', async () => {
  await styles(CSS_MAP, MANIFEST_FILE);
  const data = await amp(AMP_MAP);
  expect(data).toBe(AMP_SUCCESS);
});
