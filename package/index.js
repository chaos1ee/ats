const path = require("path");
const puppeteer = require("puppeteer");
const argv = require("yargs").argv;

const isPkg = typeof process.pkg !== "undefined";

//mac path replace
let chromiumExecutablePath = isPkg
  ? puppeteer
      .executablePath()
      .replace(
        /^.*?\/node_modules\/puppeteer/,
        path.join(path.dirname(process.execPath), "puppeteer")
      )
  : puppeteer.executablePath();

//check win32
if (process.platform == "win32") {
  chromiumExecutablePath = isPkg
    ? puppeteer
        .executablePath()
        .replace(
          /^.*?\\node_modules\\puppeteer/,
          path.join(path.dirname(process.execPath), "puppeteer")
        )
    : puppeteer.executablePath();
}

(async () => {
  if (!argv.target) {
    console.log("Please set 'target'");
    return;
  }

  const browser = await puppeteer.launch({
    executablePath: chromiumExecutablePath,
    headless: true
  });

  const page = await browser.newPage();

  await page.goto(argv.target, { waitUntil: "networkidle2" });

  await page.pdf({
    path: argv.output,
    format: "A4",
    scale: 0.95,
    printBackground: true
  });

  console.log("Printing program finished");

  await browser.close();
})();
