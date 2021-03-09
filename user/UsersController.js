const express = require('express')
const router = express.Router()
const User = require('./User')
const bcrypt = require('bcryptjs')

//pagina de usuario
router.get("/admin/users", (req, res) => {  
    User.findAll().then(users => {
        res.render("admin/users/index", { users: users } )
    })
})

//pagina de login(lembre-se de coloca-la no incio como aqui)
router.get("/login", (req, res) => {
    res.render("admin/users/login")
})

//rota de login de autenticação
router.post("/authenticate", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    User.findOne( { where: {email: email} } ).then(user => {
        if(user != undefined){ //se existe um usuario com esse email
            //validar senha
            let correct = bcrypt.compareSync(password, user.password)
            if(correct){
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect("/admin/articles")
            }else {
                res.redirect("/login")
            }
        }else {
            res.redirect("/login")
        }
    })
})

//criando logout
router.get("logout", (req, res) => {
    req.session.user = undefined
    res.redirect("/")
})


router.get("/admin/users/create", (req, res) => {
    res.render("admin/users/create")
})

//criando usuario com senha com hash
router.post("/users/create", (req, res) => {
    let email = req.body.email
    let password = req.body.password

    //para saber se ja tem um email existente
    User.findOne( { where: { email: email } } ).then( user => {
        if(user == undefined){
            let salt = bcrypt.genSaltSync(10)
            let hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email, 
                password: hash
            }).then(() => {
                res.redirect("/")
            }).catch((err) => {
                res.redirect("/")
            })
        }else {
            res.redirect("/admin/users/create")
        }
    })


    //abaixo é um teste para saber se os dados estão chegando no back-end
    //res.json( { email: email, password: password } )
})

module.exports = router