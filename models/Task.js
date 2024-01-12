const { DataTypes } = require('sequelize')

const db = require('../db/conn')

// User
const User = require('./User')

const Task = db.define('Task', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true
    },
    description: {
        type: DataTypes.STRING,
        require: true
    },
    type: {
        type: DataTypes.BOOLEAN,
        require: true
    },
    finished: {
        type: DataTypes.BOOLEAN,
        require: true
    },
})

Task.belongsTo(User)
User.hasMany(Task)

module.exports = Task