const { Telegraf, Scenes, session, Markup } = require("telegraf");
const wizardScene = require("./wizardScene");

require("dotenv").config();

const bot = new Telegraf(process.env.TOKEN);

// Wizard middleware
const stage = new Scenes.Stage([wizardScene]);
bot.use(session());
bot.use(stage.middleware());

bot.start(async (ctx) => {
  try {
    await ctx.reply(
      "Привет, я помогу тебе с покупками...",
      Markup.inlineKeyboard([
        [Markup.button.callback("Продолжить", "startWizard")],
      ])
    );

    await ctx.scene.enter("myScene");
  } catch (err) {
    console.error(err);

    ctx.reply("Что-то пошло не так!");
  }
});

bot.action("leaveWizard", async (ctx) => {
  try {
    await ctx.answerCbQuery("End middleware");

    await ctx.reply("Success!");
  } catch (err) {
    console.error(err);

    ctx.reply("Что-то пошло не так!");
  }
});

bot.launch();
