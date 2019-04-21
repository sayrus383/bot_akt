require('dotenv').config();
process.env["NTBA_FIX_319"] = 1;

const TelegramBot = require('node-telegram-bot-api');
const storage = require('node-sessionstorage')
const token = process.env.BOT_TOKEN_API;
const bot = new TelegramBot(token, { polling: true });
const VoteUser = require('./models').VoteUser;
const DebtsProperties = require('./models').DebtsProperties;
const DebtsTransports = require('./models').DebtsTransports;

let startOptions = {
    reply_markup: JSON.stringify({
      keyboard: [
        [{ text: 'Поиск избирательного участка', action: 1 }],
        // [{ text: 'Просмотр номера очереди на получение земельных участков', action: 2 }],
        [{ text: 'Реестр должников по имущественному налогу', action: 3 }],
        [{ text: 'Реестр должников по транспортному налогу', action: 4 }]
      ],
      resize_keyboard: true,
      one_time_keyboard: true,
    })
};

bot.onText(/\/start/, function (msg) {
    bot.sendMessage(msg.chat.id, 'Выберите действие:', startOptions);
});

storage.setItem('action', 0);

bot.on('message', (msg) => {
    let text = msg.text;

    switch (text) {
        case 'Поиск избирательного участка':
            bot.sendMessage(msg.chat.id, 'Введите ваш ИИН');
            storage.setItem('action', 1);
            break;

        case 'Просмотр номера очереди на получение земельных участков':
            bot.sendMessage(msg.chat.id, 'Введите ваше ФИО или ИИН');
            storage.setItem('action', 2);
            break;

        case 'Реестр должников по имущественному налогу':
            bot.sendMessage(msg.chat.id, 'Введите ваш ИИН');
            storage.setItem('action', 3);
            break;

        case 'Реестр должников по транспортному налогу':
            bot.sendMessage(msg.chat.id, 'Введите ваш ИИН');
            storage.setItem('action', 4);
            break;

        default:
            if ( storage.getItem('action') == 1 ) {
                VoteUser.findOne({ where: {iin: text} })
                    .then(res => {
                        bot.sendMessage(msg.chat.id, 'Ваш участок: ' + res.station);
                    })
                    .catch(err => {
                        bot.sendMessage(msg.chat.id, 'Информация не найдена');
                    })

                storage.setItem('action', 0);
            }
            if ( storage.getItem('action') == 2 ) {
                storage.setItem('action', 0);
            }
            if ( storage.getItem('action') == 3 ) {
                DebtsProperties.findOne({ where: {iin: text} })
                    .then(res => {
                        bot.sendMessage(msg.chat.id, '_' + res.full_name + '_\n' + 
                                '*ИИН*: ' + res.iin + '\n' + 
                                '*Основной долг по налогу на имущество*: ' + res['104102_main_property_tax_debt'] + '\n' + 
                                '*Пеня по налогу на имущество*: ' + res['104102_property_tax'] + '\n' + 
                                '*Основной долг по налогу на землю с физических лиц*: ' + res['104302_main_debt_on_land_tax_from_individuals'] + '\n' + 
                                '*Пеня по налогу на землю с физических лиц*: ' + res['104302_land_tax_on_individuals'] + '\n' + 
                                '*Основной долг по аренде земельного участка*: ' + res['105315_main_debt_on_land_lease'] + '\n' + 
                                '*Пеня по аренде земельного участка*: ' + res['105315_land_lease_interest'] + '\n' + 
                                '*Общая сумма задолженности*: ' + res['total_debt'] + '\n'
                            , { parse_mode: 'markdown' });
                    })
                    .catch(err => {
                        bot.sendMessage(msg.chat.id, 'Информация не найдена');
                    })

                storage.setItem('action', 0);
            }
            if ( storage.getItem('action') == 4 ) {
                DebtsTransports.findOne({ where: {iin: text} })
                    .then(res => {
                        bot.sendMessage(msg.chat.id, '_' + res.full_name + '_\n' + 
                                '*ИИН*: ' + res.iin + '\n' + 
                                '*Основной долг по налогу на транспорт*: ' + res['104402_main_transport_tax_debt'] + '\n' + 
                                '*Пеня по налогу на транспорт*: ' + res['104402_penalty_on_transport_tax'] + '\n' + 
                                '*Общая сумма*: ' + res['total_debt'] + '\n'
                            , { parse_mode: 'markdown' });
                    })
                    .catch(err => {
                        bot.sendMessage(msg.chat.id, 'Информация не найдена');
                    })

                storage.setItem('action', 0);
            }
      }
});