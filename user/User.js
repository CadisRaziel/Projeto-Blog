const Sequelize = require('sequelize')
const connection = require("../database/database")

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.sync({force: false})
//force: true = ele vai recriar a tabela toda hora que atualizar 
//force: false = ele vai verificar se a tabela ja existe, se existir ele não vai recriar  

module.exports = User