const Task = require('../models/Task')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class TaskController {
    static async home(req, res) {
        const userId = req.session.userid;

        if (!userId) {
            req.flash("message", "Olá usuário, é necessário estar logado para usar o App!");
            res.render("task/home");

            return;
        }

        let user;

        try {
            user = await User.findOne({
                where: { id: userId },
                include: Task
            });
        } catch (error) {
            req.flash("message", "Ocorreu um erro ao buscar o usuário.");
            res.render("task/home");

            return;
        }

        if (!user) {
            req.flash("message", "Usuário não encontrado!");
            res.render("task/home");

            return;
        }

        let tasks = [];

        if (user.Tasks) {
            tasks = user.Tasks.map((result) => result.get({ plain: true }));
        }

        res.render("task/home", { tasks });
    }
    static async createTask(req, res) {
        const userId = req.session.userid;

        if (!userId) {
            req.flash("message", "É preciso estar logado para criar uma tarefa!")
            res.render("user/login")

            return
        }

        const { title, description, type } = req.body

        if (!(title && description) && type === undefined) {
            req.flash("message", "Todas as áreas devem estar preenchidas!");
            res.render("/");

            return
        }

        let urgente = true

        if (type === "Prorrogável") {
            urgente = false
        }

        const task = {
            title,
            description,
            type: urgente,
            finished: false,
            UserId: userId
        }

        try {
            await Task.create(task)

            req.session.save(() => {
                req.flash("message", "Tarefa criada!")
                res.redirect("/")
            })
        } catch (error) {
            console.log(error)
        }
    }
    static async delTask(req, res) {
        const userId = req.session.userid

        if (!userId) {
            req.flash("message", "usuário não encontrado!")
            res.render("user/login")

            return
        }

        const id = req.body.id

        try {
            await Task.destroy({ where: { id: id } })

            req.flash("message", "Tarefa excluida com sucesso!")
            res.redirect("/")
        } catch (error) {
            console.log(error)
        }
    }
    static async toggleTask(req, res) {
        const userId = req.session.userid

        if (!userId) {
            req.flash("message", "usuário não encontrado!")
            res.render("user/login")

            return
        }

        const { id, type } = req.body

        let currentType;

        if (type === true || type === "true") {
            currentType = false
        } else if (type === false || type === "false") {
            currentType = true
        }

        try {
            await Task.update({ type: currentType }, { where: { id: id } })

            req.flash("message", "Tarefa alterada com sucesso!")
            res.redirect("/")
        } catch (error) {
            console.log(error)
        }
    }
    static async doTask(req, res) {
        const userId = req.session.userid

        if (!userId) {
            req.flash("message", "usuário não encontrado!")
            res.render("user/login")

            return
        }

        const { id, finished } = req.body

        let currentfinished;

        if (finished === true || finished === "true") {
            currentfinished = false
        } else if (finished === false || finished === "false") {
            currentfinished = true
        }

        try {
            await Task.update({ finished: currentfinished }, { where: { id: id } })

            req.flash("message", "Completa com sucesso!")
            res.redirect("/")
        } catch (error) {
            console.log(error)
        }
    }
}