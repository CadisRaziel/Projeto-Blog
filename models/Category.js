const Sequelize = require('sequelize')
const connection = require("../database/database")

const Category = connection.define('categories', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Category

//slug vai ser o titulo da rota exemplo
//se for desenvolvimento web, o slug vai transformar em desenvolvimento-web
//ou se for react.js ele transforma em react-js



//lembre-se depois de relacionar os dois models acima, atualizar o database veja abaixo:
//usar apenas 1 vez para criar a tabela e depois remover ou deixar comentado para nao criar outra tabela e der erro
//repare que nao coloquei primary key e forigin key, ele criou automatico
//*Category.sync({force: true})