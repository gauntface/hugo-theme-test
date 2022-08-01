const path = require('path');
const test = require('ava');
const StaticServer = require('static-server');
const puppeteer = require('puppeteer');

const server = new StaticServer({
  rootPath: path.join(__dirname, 'example-site', 'public'),
  port: 9999,
});

function startServer() {
  return new Promise((resolve, reject) => {
    server.start(() => {
      console.log(`Using http://localhost:${server.port}`);
      resolve(`http://localhost:${server.port}`);
    })
  });
};

let addr;
let browser;

test.before(async (t) => {
  // Server for project
  addr = await startServer();
});
test.before(async (t) => {
  // Start browser
  browser = await puppeteer.launch();
})

test.after('cleanup', async (t) => {
  // This runs before all tests
  server.stop();

  await browser.close();
});

test.beforeEach(async (t) => {
  // Create new page for test
  t.context.page = await browser.newPage();

  // Ensure we get 200 responses from the server
  t.context.page.on('response', (response) => {
    if (response) {
      t.deepEqual(response.status(), 200);
    }
  })
});

test.afterEach(async (t) => {
  await t.context.page.close();
})

test('css links', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}`);

  const links = await page.$$('link[rel="stylesheet"]')

  const linkHrefs = [];
  for(const l of links) {
    const href = await l.evaluate((l) => l.href);
    linkHrefs.push(href);
  }

  linkHrefs.sort();

  t.deepEqual(linkHrefs, [
    `${addr}/base/ham/n-ham-c-lite-yt-preload.css`,
    `${addr}/base/html/iframe.css`,
    `${addr}/base/html/img.css`,
    `${addr}/base/html/p.css`,
    `${addr}/base/html/pre.css`,
    `${addr}/base/html/svg.css`,
    `${addr}/base/html/video.css`,
    `${addr}/css/theme-assets-example.css`,
    `${addr}/css/theme-static-example.css`,
    `${addr}/css/top-static-example.css`,
  ]);
})

test('js scripts', async (t) => {
  const page = t.context.page;

  // Load webpage
  await page.goto(`${addr}`);

  const links = await page.$$('script')

  const linkHrefs = [];
  for(const l of links) {
    const href = await l.evaluate((l) => l.src);
    linkHrefs.push(href);
  }

  linkHrefs.sort();

  t.deepEqual(linkHrefs, [
    `${addr}/js/theme-assets-example.js`,
    `${addr}/js/theme-assets-ts-example.js`,
    `${addr}/js/theme-static-example.js`,
    `${addr}/js/top-static-example.js`,
  ]);
})