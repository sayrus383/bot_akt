module.exports = (sequelize, Sequelize) => {
    return sequelize.define('vote_users', {
        id: {
            type: Sequelize.INTEGER, 
            primaryKey: true, 
            autoIncrement: true 
        },

        iin: {
            type: Sequelize.STRING, 
            allowNull: false 
        },

        station: {
            type: Sequelize.STRING, 
            allowNull: false 
        },
    });
}