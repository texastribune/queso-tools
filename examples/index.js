const { styles, icons, amp } = require('../lib');
const { AMP_MAP, CSS_MAP, MANIFEST_FILE, SVG_MAP } = require('./paths');

async function build() {
  await styles(CSS_MAP, MANIFEST_FILE);
  await icons(SVG_MAP);
  await amp(AMP_MAP);
}

build().catch(err => {
  // eslint-disable-next-line no-console
  console.error(err.message);
  process.exit(1);
});
