const Sequelize = require('sequelize')
const connection = require("../database/database")

//importanto o Category para fazer um database relacional de uma via de mao dupla
const Category = require("../models/Category")

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})


//slug vai ser o titulo da rota exemplo
//se for desenvolvimento web, o slug vai transformar em desenvolvimento-web
//ou se for react.js ele transforma em react-js


//==========================
//relacionamento entre models \/ (para fazer a database)

//aqui eu faço a conexão etre os dois models
//ou seja uma categoria(Category) vai ter varios artigos(article)
// hasMany = 1-p-m (um para muitos)
Category.hasMany(Article)

//aqui eu faço a conexão entre os dois models
//ou seja um artigo(article) pertence a uma category(categoria) 
// belongsTO = 1-p-1 (um para um)
Article.belongsTo(Category)


//lembre-se depois de relacionar os dois models acima, atualizar o database veja abaixo:
//usar apenas 1 vez para criar a tabela e depois remover ou deixar comentado para nao criar outra tabela e der erro
//repare que nao coloquei primary key e forigin key, ele criou automatico
//*Article.sync({force: true})

module.exports = Article
