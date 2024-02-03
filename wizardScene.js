const { Composer, Scenes, Markup } = require("telegraf");
const parser = require("./parser");

const sleep = async (time) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });

const nameProduct = new Composer();

nameProduct.action("startWizard", async (ctx) => {
  try {
    await ctx.answerCbQuery("Start middleware");

    ctx.wizard.state.data = {};

    await ctx.reply("Введите название товара...");

    await ctx.wizard.next();
  } catch (err) {
    console.error(err);

    ctx.reply("Что-то пошло не так!");
  }
});

const region = new Composer();

region.on("text", async (ctx) => {
  try {
    ctx.wizard.state.data.nameProduct = ctx.message.text;

    await ctx.reply("Введите регион в котором нужно искать товар...");

    await ctx.wizard.next();
  } catch (err) {
    console.error(err);

    ctx.reply("Что-то пошло не так!");
  }
});

const printResult = new Composer();

printResult.on("text", async (ctx) => {
  try {
    const _temp = ctx.wizard.state.data;
    _temp.region = ctx.message.text;

    await ctx.reply("Пожалуйста, подождите! Запрос отправлен...");

    const result = await parser([_temp.region, _temp.nameProduct]);

    if (result.length) {
      result.forEach(async (elem) => {
        await ctx.reply(elem);
      });
    } else {
      await ctx.reply("По вашему запросу ничего не найдено!");
    }

    await sleep(1000);

    await ctx.reply(
      "Нажмите, чтобы продолжить...",
      Markup.inlineKeyboard([
        [Markup.button.callback("Продолжить", "leaveWizard")],
      ])
    );

    await ctx.scene.leave();
  } catch (err) {
    console.error(err);

    await ctx.reply("Не удалось ничего найти!");

    await ctx.scene.leave();
  }
});

module.exports = new Scenes.WizardScene(
  "myScene",
  nameProduct,
  region,
  printResult
);
