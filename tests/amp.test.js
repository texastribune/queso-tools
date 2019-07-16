const { amp } = require('../lib');
const { AMP_MAP } = require('../examples/paths');
const { AMP_SUCCESS } = require('../lib/constants');

it('Builds and validates AMP', async () => {
  const data = await amp(AMP_MAP);
  expect(data).toBe(AMP_SUCCESS);
});
