const path = require("path");
const puppeteer = require("puppeteer");
const shell = require("shelljs");

const DEFAULT_OUTPUT_PATH = "./ats.pdf";

const argv = require("yargs")
  .option("target", {
    alias: "t",
    demand: true,
    string: true,
    describe: "Puppeteer访问的页面URL"
  })
  .option("output", {
    alias: "o",
    demand: false,
    string: true,
    default: DEFAULT_OUTPUT_PATH,
    describe: "PDF文件输出路径"
  }).argv;

const pattern =
  process.platform == "win32"
    ? /^.*?\\node_modules\\puppeteer/
    : /^.*?\/node_modules\/puppeteer/;

const isPkg = typeof process.pkg !== "undefined";

// 路径替换
let chromiumExecutablePath = isPkg
  ? puppeteer
      .executablePath()
      .replace(pattern, path.join(path.dirname(process.execPath), "puppeteer"))
  : puppeteer.executablePath();

// 创建目录
if (argv.output != DEFAULT_OUTPUT_PATH) {
  const dir = path.resolve(__dirname, path.parse(argv.output).dir);

  if (!shell.test("-d", dir)) {
    shell.mkdir("-p", dir);
    shell.echo(`创建目录${dir}成功`);
  }
}

(async () => {
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

  console.log("打印成功");

  await browser.close();
})();
