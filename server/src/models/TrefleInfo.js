module.exports = (sequelize, DataTypes) => {
  const TrefleInfo = sequelize.define('TrefleInfo', {
    trefleID: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    commonName: {
      type: DataTypes.STRING(95),
      allowNull: false
    },
    light: {
      type: DataTypes.INTEGER
    },
    atmoHumidity: {
      type: DataTypes.INTEGER
    },
    minPrecp: {
      type: DataTypes.INTEGER
    },
    maxPrecp: {
      type: DataTypes.INTEGER
    },
    minTemp: {
      type: DataTypes.INTEGER
    },
    maxTemp: {
      type: DataTypes.INTEGER
    },
    soilHumidity: {
      type: DataTypes.INTEGER
    }
  })

  return TrefleInfo
}
