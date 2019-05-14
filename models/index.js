const Sequelize = require('sequelize');
const CONFIG = require('./../config');
const VoteUserModel = require('./VoteUser');
const DebtsPropertiesModel = require('./DebtsProperties');
const DebtsTransportsModel = require('./DebtsTransports');
const RegistryCikModel = require('./RegistryCik');
const ListSiteModel = require('./ListSite');
const SearchHistoryModel = require('./SearchHistory');


const sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
    host: CONFIG.db_host,
    dialect: 'mysql',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    define: {
      underscored: true,
      underscoredAll: true,
    }
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log('Database OK');
  })
  .catch(err => {
    console.error('Database ERROR:', err);
  });


const VoteUser = VoteUserModel(sequelize, Sequelize);
const DebtsProperties = DebtsPropertiesModel(sequelize, Sequelize);
const DebtsTransports = DebtsTransportsModel(sequelize, Sequelize);
const RegistryCik = RegistryCikModel(sequelize, Sequelize);
const ListSite = ListSiteModel(sequelize, Sequelize);
const SearchHistory = SearchHistoryModel(sequelize, Sequelize);


module.exports = {
  VoteUser,
  DebtsProperties,
  DebtsTransports,
  RegistryCik,
  ListSite,
  SearchHistory
};