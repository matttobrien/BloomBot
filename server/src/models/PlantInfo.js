module.exports = (sequelize, DataTypes) => {
  const PlantInfo = sequelize.define('PlantInfo', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    trefleID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'TrefleInfos',
        key: 'trefleID'
      },
      allowNull: false
    },
    soilMoisture: {
      type: DataTypes.INTEGER
    },
    waterLevel: {
      type: DataTypes.INTEGER
    },
    light: {
      type: DataTypes.INTEGER
    },
    temp: {
      type: DataTypes.INTEGER
    },
    humidity: {
      type: DataTypes.INTEGER
    }
  })

  return PlantInfo
}
