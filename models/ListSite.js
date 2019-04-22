module.exports = (sequelize, Sequelize) => {
    return sequelize.define('list_sites', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        site_code: {
            type: Sequelize.INTEGER, 
            allowNull: false 
        },

        status: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        site_name_ru: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        locality_ru: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        address_ru: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        locality_kk: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        site_name_kk: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        address_kk: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        house: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
    });
}