const { icons } = require('../lib');
const { SVG_MAP } = require('../examples/paths');
const { SVG_SUCCESS } = require('../lib/constants');

it('Builds icons', async () => {
  const data = await icons(SVG_MAP);
  data.forEach(msg => {
    expect(msg).toBe(SVG_SUCCESS);
  });
});
