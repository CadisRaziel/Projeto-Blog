const express = require('express')
const Category = require('../../models/Category')
const adminAuth = require('../../middlewares/adminAuth')

//carregando o slugfy (slug)
//slug serve para o nome ir para url exp: desenvolvimento web com slug fica desenvolvimento-web (ele deixa tudo minusculo e sem espaço)
const slugify = require('slugify')

//ao invez de usar app vamos usar router(que nem no nlw)
//para diferenciar do arquivo principal que usa app
const router = express.Router()


//rota para a magina http://localhost:8080/admin/categories/new
router.get("/admin/categories/new", adminAuth , (req, res) => {
    res.render("admin/categories/new")
})


//para que o usuario não cadastre uma categoria sem nome
router.post("/categories/save", adminAuth , (req, res) => {
    //colocamos essa const com codigo abaixo para utilizar do body-parser
    const title = req.body.title
    
    if (title != undefined) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories")
        })
    } else {
        res.redirect("/admin/categories/new")
    }
})

//para fazer forEach no index.ejs
router.get("/admin/categories", adminAuth, (req, res) => {
    Category.findAll().then(categories => {
        res.render("admin/categories/index", { categories: categories })
    })
})


//deletando uma linha da tabela categoria
router.post("/categories/delete", adminAuth, (req, res) => {    
    const id = req.body.id
    if (id != undefined) {
        if (!isNaN(id)) { //verifica se é numerico ou não
            Category.destroy({
                where: {
                    id: id
                }
            }).then((categories) => { res.redirect("/admin/categories") })
        } else { //se não for um numero
            res.redirect("/admin/categories")
        }
    } else { //se for nullo
        res.redirect("/admin/categories")
    }
})

//Editando itens da tabela com o botão editar
//pk = pesquisar uma categoria pelo id dela (um metodo mais agil de pesquisar algo pelo id)
router.get("/admin/categories/edit/:id", adminAuth ,(req, res) => {
    const id = req.params.id    

    //para verificar se não é um numero(se nao for da redirect)
    if(isNaN(id)){
        res.redirect("/admin/categories")
    }

    Category.findByPk(id).then(category => {
        if(category != undefined){
            res.render("admin/categories/edit",{ category: category })
        }else {
            res.redirect("/admin/categories")
        }
    }).catch(err => {
        res.redirect("/admin/categories")
    })
})



//fazendo com que o botão edit realize a edição no formulario e na database
router.post("/categories/update", adminAuth , (req, res) => {
    const id = req.body.id
    const title = req.body.title
    
    Category.update({ title: title, slug: slugify(title) }, {
        where: {
            id: id
        }        
    }).then(() => {
        res.redirect("/admin/categories")        
    })
})

module.exports = router