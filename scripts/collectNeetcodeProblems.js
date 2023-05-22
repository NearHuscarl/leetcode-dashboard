import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import mkdirp from "mkdirp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const main = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://neetcode.io/practice");

  const neetcodeAllTabEl = await page.waitForSelector(".tabs li:last-child");
  await neetcodeAllTabEl.click();

  const problemIdsByCategory = await page.evaluate(() => {
    const categories = [
      ...document.querySelectorAll(".accordion-container p:first-child"),
    ].map((el) => el.textContent);
    const tableEls = [...document.querySelectorAll("table")];

    const problemIds = tableEls.map((tableEl) => {
      return [...tableEl.querySelectorAll("td > a")]
        .map((el) => el.href)
        .filter((href) => !href.includes("lintcode"))
        .map((href) => href.replace(/.*\/(.*)\/$/, "$1"));
    });

    return categories.reduce((acc, category, index) => {
      acc[category] = problemIds[index];
      return acc;
    }, {});
  });

  const targetPath = path.join(__dirname, "..", "src", "app", "neetcode.g.ts");
  const code = `export const neetcodeProblems = ${JSON.stringify(
    problemIdsByCategory
  )};`;

  fs.writeFileSync(targetPath, code, { flag: "w" });

  await browser.close();
};

main();
