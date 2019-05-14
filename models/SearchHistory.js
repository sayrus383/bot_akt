module.exports = (sequelize, Sequelize) => {
    return sequelize.define('search_histories', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        iin: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        type: {
            type: Sequelize.ENUM,
            values: ['site', 'telegram_bot'],
            defaultValue: 'site'
        }
    });
}