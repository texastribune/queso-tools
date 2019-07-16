# @texastribune/queso-tools
> Node task runners for compiling CSS, creating SVGs, and more.

This repo accompanies our CSS+icons framework, `queso-ui`. Use the the task runners here, to compile the assets in that framework.


## Install

```sh
yarn add @texastribune/queso-tools --dev
```
```sh
npm install @texastribune/queso-tools --save-dev
```

## Tools
| modules     | params    |
| ----------- | ----------|
| styles      | `dirs`, `manifest (manifest is optional if you want files with hashed names)`|
| icons       | `dirs`    |
| amp         | `dirs`    |




## Using these tasks in the wild

Most of the tasks expect an array of directories or files with an input, `in:` key, and output, `out:` key.
To set this up, create a file called `paths.js` and declare your map of paths.

Example:

```js
// paths.js
const SCSS_DIR = './scss';
const CSS_OUTPUT_DIR = './css/';
const SVG_LIB_DIR = './node_modules/@texastribune/queso-ui/icons/base';
const SVG_OUTPUT_DIR = './templates/includes';

const CSS_MAP = [
  {
    in: `${SCSS_DIR}/styles.scss`,
    out: CSS_OUTPUT_DIR,
  },
  {
    in: `${SCSS_DIR}/styles2.scss`,
    out: CSS_OUTPUT_DIR,
  },
];
// The "in" key for icons should be an array; you can mix and match icons from @texastribune/queso-ui and some stored locally
const SVG_MAP = [
  {
    in: [
      `${SVG_LIB_DIR}/twitter.svg`,
      `${SVG_LIB_DIR}/facebook.svg`,
      './icons/custom-icon.svg',
      './icons/other-icon.svg'
    ],
    out: `${SVG_OUTPUT_DIR}/my-svg-sprite.html`,
  },
];


const AMP_MAP = [
  {
    in: `${SCSS_DIR}/styles.scss`,
    out: 'amp-include.html',
  },
];

// use if you'd like the outputted CSS to have hashed file names
const MANIFEST_FILE = `${CSS_OUTPUT_DIR}styles.json`;


module.exports = {
  CSS_MAP,
  SVG_MAP,
  AMP_MAP,
  MANIFEST_FILE,
};

```

Now create a `build.js` file in that same folder where you'll reference these paths and begin to call the various tasks in this package.

That could look something like the following:

```js
// build.js
const { styles, icons, amp } = require('@texastribune/queso-tools');
const { CSS_MAP, MANIFEST_FILE, SVG_MAP, AMP_MAP } = require('./paths');

async function build() {
  await styles(CSS_MAP, MANIFEST_FILE);
  // OR (use await if you had to glob to get your map)
  // const stylesArr = await CSS_MAP();
  // await styles(stylesArr, MANIFEST_FILE);
  await icons(SVG_MAP);
  await amp(AMP_MAP);
}

build()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error(err.message);
    process.exit(1);
  });

```
Now run `node build.js` in your local environment to fire the build script.

## Publishing

Make sure you're authenticated for npm publishing.

1. `npm login` - then follow the prompts
2. `npm run release` - There's a [bug](https://github.com/sindresorhus/np/issues/420#issuecomment-499273013) in the `np` publishing tool we use where `yarn` commands don't seem to work.