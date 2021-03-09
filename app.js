const express = require('express')
const app = express()
const bodyParse = require('body-parser')
const connection = require("./database/database")
const session = require('express-session')
const port = 8080

const categoriescontroller = require("./Controllers/categories/CategoriesController")
const articlescontroller = require("./Controllers/articles/ArticlesController")
const userscontroller = require("./user/UsersController")

//importando os models
const Article = require("./models/Article")
const Category = require("./models/Category")
const User = require("./user/User")



//============================================================= 
//database connection 
connection.authenticate()
    .then(() => {
        console.log('Connection to the online database')
    })
    .catch(err => {
        console.log(err)
    })

//==============================================================
//bibliotecas

//estou dizendo para o Express usar o EJS como view engine
app.set('view engine', 'ejs')

//utilizando arquivos estaticos "('public') é o nome da pasta" [é para que aceite css, js front end, imagens etc..]
app.use(express.static('public'))

//Sessions
app.use(session({
    secret: "mnbvpoijqwefdal",
    cookie: { maxAge: 60000000 } //maxage = o tempo que a sessao vai ficar logado no servidor esta em milesegundos e depois expirar
//(lembre-se toda vez que o servidor reiniciar as sessoes)
}))

//adicionando o body parse para ver os itens no console
app.use(bodyParse.urlencoded({limit: '100mb', extended: false}))

//lendo dados de formularios enviados via json(mais usado para api)
app.use(bodyParse.json())

//=============================================================
//rotas

//usando router da pasta categories
app.use("/", categoriescontroller)


//usando router da pasta articles
app.use("/", articlescontroller)

//usando a router da pasta users
app.use("/", userscontroller)




//usado para fazer a rota home e forEach dos artigos e do homenavbar (e colocando limite de artigos na pagina inicial "limit: 4")
app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then( categories => {
            res.render("home", { articles: articles, categories: categories})
        })
    })
})


//utilizando o slug para que ele apareça na url
app.get("/:slug", (req, res) => {
    const slug = req.params.slug
    Article.findOne({ 
        where: { slug: slug }
    }).then(article => {
        if(article != undefined){
            Category.findAll().then( categories => {
                res.render("article", { article: article, categories: categories})
            })        
        }else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})


app.get("/category/:slug", (req, res) => {
    const slug = req.params.slug
    Category.findOne({ 
        where: { slug: slug }, include: [ { model: Article } ]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render("home",{ articles: category.articles, categories: categories } )
            })
        }else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})


app.listen(port, function (erro) {
    if (erro) {
        console.log("Connection error!")
    } else {
        console.log(`The server is running on the port ${port}`)
    }
})


module.exports = app