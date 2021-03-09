const express = require('express')
const Category = require('../../models/Category')
const Article = require('../../models/Article')
const slugify = require("slugify")
const adminAuth = require('../../middlewares/adminAuth') //middleware para o usuario só acessar as paginas se estiver logado

//ao invez de usar app vamos usar router(que nem no nlw)
//para diferenciar do arquivo principal que usa app
const router = express.Router()

//faz o forEach no index.ejs para listar os articles na pagina index
router.get("/admin/articles", adminAuth ,(req, res) => {
    Article.findAll({
        include: [{ model: Category }] //para puxar os dados da tabela categoria e mostrar no artigo no index.ejs(articles) "<td> <%= article.category.title %> </td>"
    }).then(articles => {
        res.render("admin/articles/index", { articles: articles })
    })
})


//faz o forEach no new.ejs das views articles (para listar as categorias)
router.get("/admin/articles/new", adminAuth , (req, res) => {
    Category.findAll().then(categories => {         
        res.render("admin/articles/new", { categories: categories })
    })
})

//salvando um artigo na datanase
router.post("/article/save", adminAuth,  (req, res) => {
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category,
        //categoryId esta na database(é uma foreign key) ela foi criada quando definimos "Article.belongsTo(Category)"
    }).then(() => {
        res.redirect("/admin/articles")
    })
})



//deletando uma linha da tabela article
router.post("/articles/delete", adminAuth , (req, res) => {    
    const id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) { //verifica se é numerico ou não
            Article.destroy({
                where: {
                    id: id
                }
            }).then((categories) => { res.redirect("/admin/articles") })
        } else { //se não for um numero
            res.redirect("/admin/articles")
        }
    } else { //se for nullo
        res.redirect("/admin/articles")
    }
})

//rota de edição
router.get("/admin/articles/edit/:id", adminAuth , (req, res) => {
    const id = req.params.id
    Article.findByPk(id).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("admin/articles/edit", { categories: categories, article: article } )
            })
        }else {
            res.redirect("/")
        }
    }).catch(err => {
        res.redirect("/")
    })
})

//salvando a edição na database quando clicar em editar e salvar
router.post("/articles/update", adminAuth , (req, res) => {
    const id = req.body.id
    const title = req.body.title
    const body = req.body.body
    const category = req.body.category 

    Article.update({title: title, body: body, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id
        }
    }).then(() => {
        res.redirect("/admin/articles")
    }).catch( err => {
        res.redirect("/")
    })
})


//criando paginação(retorna a quantidade de artigos e posso colocar quantos artigos por pagina eu quero, exp pagina 1 quero 10 artigos só)
router.get("/articles/page/:num", (req, res) => {
    const page = req.params.num
    let offset = 0

    if(isNaN(page) || page == 1){
        offset = 0;
    }else {
        offset = (parseInt(page) -1) * 4
    }

    Article.findAndCountAll({
        //pagina 0 = do 0 ate o 3 artigo
        limit: 4, //pagina 2 = 4 - 7 artigos
        offset: offset, //pagina 3 = 8 - 11 artigos
        order: [
            ['id', 'DESC']
        ] 
    }).then(articles => {
        let next
        if(offset + 4 >= articles.count){
            next = false
        }else {
            next = true
        }

        let result = {
            page: parseInt(page),
            next: next,
            articles : articles,
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories})            

        })

    })
})

module.exports = router