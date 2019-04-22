module.exports = (sequelize, Sequelize) => {
    return sequelize.define('registry_ciks', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        iin: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        last_name: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        first_name: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        third_name: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        site_code: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
    });
}