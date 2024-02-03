const puppetteer = require("puppeteer");

module.exports = async (nameProduct, region) => {
  try {
    let isSome = false;
    let resObj = null;

    const sleep = async (time) =>
      new Promise((resolve, reject) => {
        setTimeout(() => resolve(true), time);
      });

    const browser = await puppetteer.launch({
      headless: false,
      args: ["--no-sandbox"],
    });

    await (async () => {
      try {
        const searchSort = async () => {
          await page.click(".sort-textWrapper-Zwh2T");

          await page.click("[data-marker='sort/custom-option(1)']");
          await sleep(1000);
        };

        const page = await browser.newPage();

        await page.goto("https://www.avito.ru/");

        await page.waitForSelector(".desktop-1y5t16o");

        await page.click(".desktop-1y5t16o");

        await page.waitForSelector(".suggest-input-rORJM");

        const textOfRegions = await page.evaluate(() => {
          return document.querySelector(".suggest-input-rORJM").value;
        });

        await page.click(".suggest-input-rORJM");

        for (let i = 0; i < textOfRegions.length; i++) {
          if (textOfRegions.toLowerCase() === region.toLowerCase()) {
            isSome = true;
            break;
          }

          await page.keyboard.press("Backspace");
        }

        if (!isSome) {
          await page.focus(".suggest-input-rORJM");

          await page.keyboard.type(region, { delay: 50 });

          await sleep(1000);

          await page.keyboard.press("ArrowDown", { delay: 50 });
          await page.keyboard.press("ArrowDown", { delay: 50 });

          await page.keyboard.press("Enter");
        }

        await page.waitForSelector(
          "[data-marker='popup-location/radius-list/option(5)']"
        );

        await page.click(
          "[data-marker='popup-location/radius-list/option(5)']"
        );

        await page.waitForSelector(".desktop-xujs2d");

        await page.click(".desktop-xujs2d");

        await page.waitForSelector(".input-input-Zpzc1");

        const textOfProduct = await page.evaluate(() => {
          return document.querySelector(".input-input-Zpzc1").value;
        });

        await page.click(".input-input-Zpzc1");

        for (let i = 0; i < textOfProduct.length; i++) {
          await page.keyboard.press("Backspace");
        }

        await page.focus(".input-input-Zpzc1");

        await page.keyboard.type(nameProduct, { delay: 50 });

        await page.waitForSelector(".desktop-15w37ob");

        await page.click(".desktop-15w37ob");

        await page.waitForNavigation();

        await searchSort();

        let _arr = await page.evaluate(() => {
          return Array.from(
            document.querySelectorAll(".iva-item-sliderLink-uLz1v"),
            (elem) => elem.href
          );
        });

        const result = [
          _arr?.[0] || 0,
          _arr?.[1] || 0,
          _arr?.[2] || 0,
          _arr?.[3] || 0,
          _arr?.[4] || 0,
          _arr?.[5] || 0,
        ].filter((elem) => elem !== 0);

        await browser.close();

        resObj = { result, performanceFn: performance.now().toFixed(2) / 1000 };
      } catch (err) {
        browser.close();
      }
    })();

    return resObj;
  } catch (err) {
    console.error(err);
  }
};
