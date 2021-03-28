// const fetch = require('node-fetch')
const { PlantInfo, TrefleInfo } = require('./models')
const db = require('./models/index')

// this is unsecure due to time constraints and memory restirctions on our arduino
// i would have liked to include a JWT to authenitcate requests
// and included user accounts, but this is the best we could do

module.exports = (app) => {
  app.get('/init', async (req, res) => {
    try {
      // const response = await fetch('https://trefle.io/api/v1/species/155728/?token=al62gRQUvrltV5Nz4w1hwMrSnWGUrKO1LIryyjuHUdk')
      // const json = await response.json()
      // const growth = json.data.growth
      // TrefleInfo.create({
      //   trefleID: 155728,
      //   commonName: 'Wild mint',
      //   light: growth.light,
      //   atmoHumidity: growth.atmospheric_humidity,
      //   minPrecp: growth.minimum_precipitation.mm,
      //   maxPrecp: growth.maximum_precipitation.mm,
      //   minTemp: growth.minimum_temperature.deg_c,
      //   maxTemp: growth.maximum_temperature.deg_c,
      //   soilHumidity: growth.soil_humidity
      // })
      const info = await TrefleInfo.findOne({
        where: {
          trefleID: 155728
        }
      })
      res.send({
        treffleID: info.dataValues.treffleID,
        light: info.dataValues.light,
        atmoHumidity: info.dataValues.atmoHumidity,
        minPrecp: info.dataValues.minPrecp,
        maxPrecp: info.dataValues.maxPrecp,
        minTemp: info.dataValues.minTemp,
        maxTemp: info.dataValues.maxTemp,
        soilHumidity: info.dataValues.soilHumidity
      })
    } catch (error) {
      res.status(500).send()
    }
  })

  app.get('/getPlants', async (req, res) => {
    try {
      const plants = await db.sequelize.query('select p."trefleID", t."commonName" from "PlantInfos" as p, "TrefleInfos" as t WHERE p."trefleID" = t."trefleID" GROUP BY t."commonName", p."trefleID"', { type: db.sequelize.QueryTypes.SELECT })
      res.send(plants)
    } catch (error) {
      console.log(error)
      res.status(500).send()
    }
  })

  app.post('/getPlantInfo', async (req, res) => {
    try {
      const trefleID = req.body.trefleID
      const info = await PlantInfo.findAll({
        attributes: ['createdAt', 'soilMoisture', 'waterLevel', 'light', 'temp', 'humidity'],
        where: {
          trefleID: trefleID
        },
        order: [
          ['createdAt', 'DESC']
        ],
        limit: 10
      })
      res.send(info)
    } catch (error) {
      res.status(500).send()
    }
  })

  app.post('/update', async (req, res) => {
    try {
      const treffleID = 155728
      const soilMoisture = req.body.moisture
      const waterLevel = req.body.water
      const light = req.body.uv
      const temp = req.body.temp
      const humidity = req.body.humidity
      await db.sequelize.query(`INSERT INTO "PlantInfos" ("trefleID", "soilMoisture", "waterLevel", light, temp, humidity, "createdAt", "updatedAt") VALUES (${treffleID}, ${soilMoisture}, ${waterLevel}, ${light}, ${temp}, ${humidity}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, { type: db.sequelize.QueryTypes.INSERT })
      res.status(200).send()
    } catch (error) {
      console.log(error)
      res.status(500).send()
    }
  })
}
