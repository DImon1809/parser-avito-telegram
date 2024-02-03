const puppeteer = require("puppeteer");
const ruToLat = require("./ruToLat");

const parser = async (data) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      // executablePath: "/usr/bin/chromium-browser",
      // args: ["--no-sandbox"],
    });

    const page = await browser.newPage();

    let _res = [];

    await (async () => {
      await page.goto(
        `https://www.avito.ru/${data[0]}?p=1&q=${data.at(
          -1
        )}&s=1&searchRadius=75`
      );

      await page.waitForSelector("[data-marker='item-title']");

      let _arr = await page.evaluate(() => {
        return Array.from(
          document.querySelectorAll("[data-marker='item-title']"),
          (_elem) => _elem.href
        );
      });

      _res = [
        _arr?.[0] || 0,
        _arr?.[1] || 0,
        _arr?.[2] || 0,
        _arr?.[3] || 0,
        _arr?.[4] || 0,
        _arr?.[5] || 0,
      ].filter((_elem) => _elem !== 0);

      await browser.close();
    })();

    return _res;
  } catch (err) {
    console.log(err);

    browser.close();
  }
};

const sendDataInParser = async (result) => {
  try {
    const data = [
      ruToLat(result[0]),
      result
        .at(-1)
        .toLowerCase()
        .replace(/[-\+()\*,:^!\s]/gi, ""),
    ];

    return await parser(data);
  } catch (err) {
    console.error(err);
  }
};

module.exports = sendDataInParser;
