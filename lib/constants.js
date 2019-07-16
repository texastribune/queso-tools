const SCSS_SUCCESS = 'Compiled SCSS';
const SVG_SUCCESS = 'Built sprite';
const AMP_SUCCESS = 'Built AMP stylesheet';
const AMP_BOILERPLATE = `<!doctype html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <title>AMP Starter</title>
    <link rel="canonical" href="https://amp.dev/documentation/guides-and-tutorials/start/create/basic_markup">
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
    {{injectAMP}}
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
  </head>
  <body>
  </body>
</html>`;

module.exports = {
  AMP_BOILERPLATE,
  AMP_SUCCESS,
  SCSS_SUCCESS,
  SVG_SUCCESS,
};
