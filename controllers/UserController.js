const User = require('../models/User')

const bcrypt = require('bcryptjs')

module.exports = class UserController {
    static login(req, res) {
        res.render('user/login')
    }
    static async loginPost(req, res) {
        const { email, password } = req.body

        if (!(email || password)) {
            req.flash("message", "Todos os parametros dever ser preenchidos!")
            res.render("user/login")

            return
        }

        const emailRegex = /^\S+@\S+\.\S+/;
        const checkIfEmailIsValid = emailRegex.test(email)

        if (!checkIfEmailIsValid) {
            req.flash("message", "O E-mail deve ser valido!")
            res.render("user/login")

            return
        }

        const user = await User.findOne({ where: { email: email } })

        if (!user) {
            req.flash("message", "usuário não encontrado!")
            res.render("user/login")

            return
        }

        const passwordMatch = bcrypt.compareSync(password, user.password)

        if (!passwordMatch) {
            req.flash("message", "Senha incorreta!")
            res.render("user/login")

            return
        }

        try {
            const createduser = user

            req.session.userid = createduser.id

            req.flash('message', 'Autentificação realizada com sucesso!')

            req.session.save(() => {
                res.redirect('/')
            })
        } catch (error) {
            console.log(error)
        }
    }
    static register(req, res) {
        res.render('user/register')
    }
    static async registerPost(req, res) {
        const { name, lastname, email, password, confirmPassword } = req.body

        if (!(name || lastname || email || password || confirmPassword)) {
            req.flash("message", "Todos os parametros dever ser preenchidos!")
            res.render("user/register")

            return
        }

        if (!email) {
            req.flash("message", "O E-mail deve ser preenchido!")
            res.render("user/register")

            return
        }

        const emailRegex = /^\S+@\S+\.\S+/;
        const checkIfEmailIsValid = emailRegex.test(email)

        if (!checkIfEmailIsValid) {
            req.flash("message", "O E-mail deve ser valido!")
            res.render("user/register")

            return
        }

        const checkIfUserExists = await User.findOne({ where: { email: email } });

        if (checkIfUserExists) {
            req.flash('message', 'E-mail já está em uso')
            res.render('user/register')

            return
        }

        if (password != confirmPassword) {
            req.flash("message", "As senhas não conferem, tente novamente!")
            res.render("user/register")

            return
        }

        if (password.length < 6) {
            req.flash("message", "A senha deve conter 6 ou mais caracteres")
            res.render("user/register")

            return
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(password, salt)

        const user = {
            name: `${name} ${lastname}`,
            email,
            password: hashedPassword
        }

        try {
            const createduser = await User.create(user)

            req.session.userid = createduser.id

            req.flash("message", "Cadastro realizado com sucesso!")

            req.session.save(() => {
                res.redirect("/")
            })
        } catch (error) {
            console.log(error)
        }
    }
    static logout(req, res) {
        req.session.destroy()
        res.redirect('/user/login')
    }
}