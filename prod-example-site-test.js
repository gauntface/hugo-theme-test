const path = require('path');
const test = require('ava');
const glob = require('glob');

const siteDir = path.join(__dirname, 'example-site', 'public');

test.serial('css links', async (t) => {
  const files = glob.sync('**/*.css', {
      cwd: siteDir,
  });
  files.sort();

  t.deepEqual(files, [
    `base/ham/n-ham-c-lite-yt-async.css`,
    `base/html/iframe.css`,
    `base/html/img.css`,
    `base/html/p.css`,
    `base/html/pre.css`,
    `base/html/svg.css`,
    `base/html/video.css`,
    `css/theme-assets-example.css`,
    `css/theme-static-example.css`,
    `css/top-static-example.css`,
  ]);
})

test.serial('js scripts', async (t) => {
  const files = glob.sync('**/*.js', {
    cwd: siteDir,
  });
  files.sort();

  t.deepEqual(files, [
    `js/theme-assets-example.js`,
    `js/theme-assets-ts-example.js`,
    `js/theme-static-example.js`,
    `js/top-static-example.js`,
  ]);
})