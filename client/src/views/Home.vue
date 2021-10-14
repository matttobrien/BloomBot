<template>
  <div class="home">
    <b-container>
      <b-row>
        <b-col cols="12">
          <div class="shadow bg-white rounded" id="container">
            <b-navbar variant="faded" type="dark" style="background-color:#27ae60;">
              <b-navbar-brand tag="h1" class="mb-0">Welcome</b-navbar-brand>
            </b-navbar>
            <b-navbar variant="faded" type="light">
              <b-form-select v-model="selected" :options="plants"></b-form-select>
            </b-navbar>
            <b-container fluid>
              <b-row>
                <b-col sm="6">
                  <b-img src="https://bs.plantnet.org/image/o/d3097f130ca6c054b04f9d1681805ce2f147f4a1" fluid style="height:90%;"></b-img>
                </b-col>
                <b-col sm="6">
                  <b-skeleton-table
                    v-if="!loaded"
                    :rows="5"
                    :columns="1"
                    :table-props="{ bordered: true, striped: true }"
                    :animation="animation"
                  ></b-skeleton-table>
                  <b-table v-else stacked outlined :items="plantInfo">
                    <template #cell(Water-Level)="data">
                      <span v-if="data.item['Water-Level'] <= 155" class="text-danger">{{ data.item['Water-Level'] }}</span>
                      <span v-else class="text-danger">{{ data.item['Water-Level'] }}</span>
                    </template>
                  </b-table>
                  <b-navbar variant="faded" type="light">
                    <div class="col text-center">
                      Please find the most current info above.
                    </div>
                  </b-navbar>
                </b-col>
              </b-row>
            </b-container>
          </div>
          <div class="shadow bg-white rounded">
            <b-row>
              <b-col cols="12">
                <b-navbar variant="faded" type="dark" style="background-color:#27ae60;">
                  <b-navbar-brand tag="h1" class="mb-0">History</b-navbar-brand>
                </b-navbar>
                <b-skeleton-table
                  v-if="!loaded"
                  :rows="10"
                  :columns="6"
                  :table-props="{ bordered: true, striped: true }"
                  :animation="animation"
                ></b-skeleton-table>
                <b-table v-else striped hover :items="plantHistory"></b-table>
              </b-col>
            </b-row>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PlantService from '@/services/plantService'
import { format } from 'date-fns'
export default {
  name: "Home",
  data() {
    return {
      loading: false,
      loaded: false,
      animation: 'none',
      selected: null,
      plants: [
        { value: null, text: 'Please select an option' }
      ],
      plantInfo: [],
      plantHistory: []
    }
  },
  watch: {
    selected: function (val) {
      this.getPlantInfo(val)
    },
    loading: function (val) {
      if (val) {
        this.animation = 'wave'
      } else {
        this.animation = 'none'
      }
    }
  },
  created () {
    this.getPlants()
  },
  methods: {
    async getPlants () {
      try {
        const respose = await PlantService.getPlants()
        for (let i in respose.data) {
          this.plants.push({
            value: respose.data[i].trefleID, text: respose.data[i].commonName
          })
        }
      } catch (error) {
        console.error(error)
      }
    },
    async getPlantInfo (trefleID) {
      try {
        this.loaded = false
        this.loading = true
        this.plantInfo = []
        const response = await PlantService.getPlantInfo({
          trefleID: trefleID
        })
        for (let i in response.data) {
          if (i == 0) {
            this.plantInfo.push({
              "Soil-Moisture": response.data[i].soilMoisture,
              "Water-Level": response.data[i].waterLevel,
              "Light": response.data[i].light,
              "Temperature": response.data[i].temp,
              "Humidity": response.data[i].humidity
            })
          }
          let date = new Date(response.data[i].createdAt)
          this.plantHistory.push({
            "Time": format(date, 'MM/dd/yyyy HH:mm'),
            "Soil Moisture": response.data[i].soilMoisture,
            "Water Level": response.data[i].waterLevel,
            "Light": response.data[i].light,
            "Temperature": response.data[i].temp,
            "Humidity": response.data[i].humidity
          })
        }
        this.loading = false
        this.loaded = true
      } catch (error) {
        console.error(error)
      }
    },
    rowClass (item, type) {
      console.log(item)
      if (!item || type !== 'row') return
      if (item["Water Level"] >= 155) return 'table-warning'
    }
  }
};
</script>

<style scoped>
#container {
  margin-bottom: 2%;
}
</style>
