// utility packages
const fs = require('fs-extra');
const glob = require('fast-glob');
const ora = require('ora');
const path = require('path');

// icon packages
const { optimize } = require('svgo');

// internal
const { logMessage } = require('./utils');
const { SVG_SUCCESS } = require('./constants');

const spinner = ora();

const createSymbol = async (currentSVG) => {
  // extract svg contents
  const svgContents = fs.readFileSync(currentSVG, 'utf-8');

  // use SVGO to optimize contents string
  const optimizedSVG = await optimize(svgContents);

  // clean original file
  await fs.writeFileSync(currentSVG, optimizedSVG.data, 'utf-8');

  // hacky way to convert svg->symbol (saves us a sprite dependency)
  const customSVG = await optimize(svgContents, {
    plugins: [
      {
        name: 'removeDimensions',
        active: true,
      },
      {
        name: 'removeXMLNS',
        active: true,
      },
      {
        name: 'addAttributesToSVGElement',
        params: {
          attributes: [
            {
              id: path.basename(currentSVG, path.extname(currentSVG)),
            },
          ],
        },
      },
      {
        name: 'sortAttrs',
        active: true,
      },
    ],
  });
  return customSVG.data.replace(/svg/g, 'symbol');
};

const processSVGs = async (dirMap) => {
  const input = dirMap.in;
  let svgs = input;

  // check if a whole directory is passed
  if (typeof input === 'string' && !path.extname(input)) {
    svgs = await glob(`${input}/*.svg`);
    // check if dir is empty
    if (svgs.length < 1) {
      spinner.warn(`No icons found in ${input}`);
    }
  }

  // loop through each icon and compile sprite
  const svgMap = await Promise.all(svgs.map((svg) => createSymbol(svg)));

  // write sprite to dir
  try {
    await fs.outputFile(dirMap.out, `<svg>${svgMap.join('')}</svg>`);
  } catch (err) {
    logMessage(err);
    throw err;
  }

  return SVG_SUCCESS;
};

module.exports = async (dirs) => {
  spinner.start('Build icons');

  return Promise.all(dirs.map((dirMap) => processSVGs(dirMap)))
    .then((resp) => {
      spinner.succeed();
      return resp;
    })
    .catch((error) => {
      spinner.fail();
      throw new Error(error.message);
    });
};
