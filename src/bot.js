import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { getNumerologyData, getTokenApiAstro } from "./astro_service.js";


const bot = new Telegraf(config.get('telegram_token'))
getTokenApiAstro()
const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\+\d{2}:\d{2})?)?$/;

bot.on('text', async (ctx) => {
  const message = ctx.message.text;

  if (iso8601Regex.test(message)) {
    const isoDate = message.includes('T') ? message : `${message}T00:00:00Z`;
    try {
      await getTokenApiAstro();
      const response = await getNumerologyData(isoDate);
      if (response.status === 'ok') {
        const lifePathNumber = response.data.life_path_number;
        ctx.reply(`${lifePathNumber.description}`);
      } else {
        ctx.reply('Ошибка: Не удалось получить данные о числе жизненного пути.');
      }
    } catch (error) {
      ctx.reply('Произошла ошибка при получении данных');
    }
  } else {
    ctx.reply('Неверный формат даты. Используйте формат даты 1999-12-31');
  }
});

bot.command('start', async (cntx)=> {
  await cntx.reply(JSON.stringify(cntx.message, null, 2))
})

bot.launch()

process.once('SIGINT', ()=> bot.stop('SIGINT'))
process.once('SIGTERM', ()=> bot.stop('SIGTERM'))