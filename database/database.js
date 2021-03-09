//conexão com o database usando sequelize(bem simples né)

const Sequelize = require('sequelize')

const connection = new Sequelize('blog', 'root', 'rhythms', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: "-03:00" //resolvendo o problema do horario no mysql (fazer isso em todos projetos)
})

module.exports = connection

//timezone: "-03:00" resolvendo o problema do horario no mysql 
//temos que por isso pois o mysql coloca um UTC universal(ficticio)
//então todo projeto devemos definir o UTC dependendo do pais do projeto 