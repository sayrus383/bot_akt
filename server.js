require('dotenv').config();
process.env["NTBA_FIX_319"] = 1;

const TelegramBot = require('node-telegram-bot-api');
const storage = require('node-sessionstorage')
const token = process.env.BOT_TOKEN_API;
const bot = new TelegramBot(token, { polling: true });
const i18n = require('i18n');
const DebtsProperties = require('./models').DebtsProperties;
const DebtsTransports = require('./models').DebtsTransports;
const RegistryCik = require('./models').RegistryCik;
const ListSite = require('./models').ListSite;

i18n.configure({
    locales:['kk', 'ru'],
    directory: __dirname + '/lang',
    defaultLocale: 'ru',
});


var langOptions = {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Қазақша 🇰🇿', callback_data: 'kk' }],
        [{ text: 'Русский 🇷🇺', callback_data: 'ru' }],
      ]
    })
  };

let startOptions = () => {
    return {
        reply_markup: JSON.stringify({
        keyboard: [
            [{ text: i18n.__('site_search'), action: 1 }],
            // [{ text: 'Просмотр номера очереди на получение земельных участков', action: 2 }],
            [{ text: i18n.__('properties_search'), action: 3 }],
            [{ text: i18n.__('transports_search'), action: 4 }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
        })
    };
}


bot.on('callback_query', function (msg) {
    i18n.setLocale(msg.data);
    bot.sendMessage(msg.message.chat.id, i18n.__('select_action'), startOptions());
});

bot.onText(/\/start/, function (msg) {
    storage.setItem('action', 0);
    bot.sendMessage(msg.chat.id, 'Выберите язык (Тілді таңдаңыз)', langOptions);
});

storage.setItem('action', 0);

bot.on('message', (msg) => {
    let text = msg.text;

    switch (text) {
        case i18n.__('site_search'):
            bot.sendMessage(msg.chat.id, i18n.__('write_iin'));
            storage.setItem('action', 1);
            break;

        case 'Просмотр номера очереди на получение земельных участков':
            bot.sendMessage(msg.chat.id, 'Введите ваше ФИО или ИИН');
            storage.setItem('action', 2);
            break;

        case i18n.__('properties_search'):
            bot.sendMessage(msg.chat.id, i18n.__('write_iin'));
            storage.setItem('action', 3);
            break;

        case i18n.__('transports_search'):
            bot.sendMessage(msg.chat.id, i18n.__('write_iin'));
            storage.setItem('action', 4);
            break;

        default:
            if ( storage.getItem('action') == 1 ) {
                RegistryCik.findOne({ where: {iin: text} })
                    .then(res => {
                        ListSite.findOne({ where: {site_code: res.site_code} })
                            .then(result => {
                                let textResponse = '_' + res.last_name + ' ' + res.first_name + ' ' + res.third_name + '_\n';
                                textResponse += '*' + i18n.__('your_site') +'*: \n';
                                textResponse += '*№ ' + result.site_code +'*, ';

                                if ( i18n.getLocale() == 'ru' ) {
                                    textResponse += result.locality_ru ? result.locality_ru + ', ' : '';
                                    textResponse += result.site_name_ru ? result.site_name_ru + ', ' : '';
                                    textResponse += result.address_ru ? result.address_ru + ', ' : '';
                                }
                                else if ( i18n.getLocale() == 'kk' ) {
                                    textResponse += result.locality_kk ? result.locality_kk + ', ' : '';
                                    textResponse += result.site_name_kk ? result.site_name_kk + ', ' : '';
                                    textResponse += result.address_kk ? result.address_kk + ', ' : '';
                                }

                                textResponse += result.house ? result.house : '';


                                bot.sendMessage(msg.chat.id, textResponse, { parse_mode: 'markdown' });
                            })
                            .catch(error => {
                                bot.sendMessage(msg.chat.id, i18n.__('not_found_site') + ':\n' + '*8(7132) 445603, 445601, 445602, 445600*', { parse_mode: 'markdown' });
                            })
                    })
                    .catch(err => {
                        bot.sendMessage(msg.chat.id, i18n.__('not_found_site') + ':\n' + 
                        '+7 (7132) 44-56-03\n' +  
                        '+7 (7132) 44-56-01\n' +  
                        '+7 (7132) 44-56-02\n' +  
                        '+7 (7132) 44-56-00\n',  
                        
                        { parse_mode: 'markdown' });
                    })

                storage.setItem('action', 0);
            }
            else if ( storage.getItem('action') == 2 ) {
                storage.setItem('action', 0);
            }
            else if ( storage.getItem('action') == 3 ) {
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
                        bot.sendMessage(msg.chat.id, i18n.__('not_found'));
                    })

                storage.setItem('action', 0);
            }
            else if ( storage.getItem('action') == 4 ) {
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
                        bot.sendMessage(msg.chat.id, i18n.__('not_found'));
                    })

                storage.setItem('action', 0);
            }
            else {
                storage.setItem('action', 0);
                bot.sendMessage(msg.chat.id, i18n.__('select_action'), startOptions());
            }
      }
});