const Sequelize = require('sequelize-cockroachdb')
const fs = require('fs')
const path = require('path')
const db = {}

// Connect to CockroachDB through Sequelize.
const sequelize = new Sequelize({
  dialect: 'postgres',
  username: 'ben',
  password: 'C7WdWRgtUiRwKmrK',
  host: 'free-tier4.aws-us-west-2.cockroachlabs.cloud',
  port: 26257,
  database: 'db-serre-92.gloom',
  dialectOptions: {
    ssl: {
      // For secure connection:
      ca: fs.readFileSync('/Users/mattobrien/certs/cc-ca.crt')
        .toString()
    }
  },
  logging: false
})

fs
  .readdirSync(__dirname)
  .filter((file) =>
    file !== 'index.js'
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  })

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
