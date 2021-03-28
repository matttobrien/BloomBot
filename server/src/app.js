const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const { sequelize } = require('./models')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('combined'))
app.use(cors())
app.use(helmet())

require('./routes')(app)

sequelize.sync({ force: false })
  .then(() => {
    app.listen(process.env.PORT || 8081)
    console.log(`Server started on port ${process.env.PORT || 8081}`)
  })
