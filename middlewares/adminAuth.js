//middleware para verificar se o usuario estiver logado, se estiver vai para o proximo passo que é acessar as rotas admin

function adminAuth(req, res, next) {
    if(req.session.user != undefined){ //se ele estiver logado
        next() //ele pode passar para rota 
    }else {
        //se ele não estiver logado, vai pra home page
        res.redirect("/login")
    }
}

module.exports = adminAuth