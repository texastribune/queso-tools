const { copy } = require('../lib');
const { COPY_MAP } = require('../examples/paths');
const { COPY_SUCCESS } = require('../lib/constants');

it('Copies directories or files', async () => {
  const data = await copy(COPY_MAP);
  expect(data).toStrictEqual([COPY_SUCCESS, COPY_SUCCESS]);
});
