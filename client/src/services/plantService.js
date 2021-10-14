import api from '@/services/api'

export default {
  getPlants () {
    return api().get('getPlants')
  },
  getPlantInfo (trefleID) {
    return api().post('getPlantInfo', trefleID)
  }
}