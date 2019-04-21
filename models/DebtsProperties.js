module.exports = (sequelize, Sequelize) => {
    return sequelize.define('debts_properties', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        iin: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        full_name: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '104102_main_property_tax_debt': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '104102_property_tax': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '104302_main_debt_on_land_tax_from_individuals': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '104302_land_tax_on_individuals': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '105315_main_debt_on_land_lease': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '105315_land_lease_interest': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        'total_debt': {
            type: Sequelize.STRING, 
            allowNull: false 
        },
    });
}