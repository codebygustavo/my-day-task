const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('myDayTask', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

try {
    sequelize.authenticate()
    console.log('Conectado com banco de dados')
} catch (error) {
    console.log(error)
}

module.exports = sequelize