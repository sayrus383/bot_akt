module.exports = (sequelize, Sequelize) => {
    return sequelize.define('debts_transports', {
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

        '104402_main_transport_tax_debt': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        '104402_penalty_on_transport_tax': {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        'total_debt': {
            type: Sequelize.STRING, 
            allowNull: false 
        },
    });
}