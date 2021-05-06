<template>
  <div>
    <v-row>
      <v-col class="pb-0 font-weight-bold grey--text text--darken-2">
        Required item
        <v-icon dense color="red" v-if="!isSearchableGenre"
          >mdi-close-thick
        </v-icon>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-1">
        <v-divider class="mr-1"></v-divider>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="py-1">
        <genre-seed-select
          class="py-0"
          @selectGenre="receiveGenreSeed"
          :genreSeeds="genreSeeds"
        ></genre-seed-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pb-0 font-weight-bold grey--text text--darken-2">
        Optional item
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-1 pb-3">
        <v-divider class="mr-1"></v-divider>
      </v-col>
    </v-row>
    <option-slider
      v-for="item in params"
      :key="item.name"
      :unit="item"
    ></option-slider>

    <v-row>
      <v-col class="pb-0">
        <v-col class="py-0 px-0">
          <v-text-field
            class="pa-0 noneUnderLine"
            v-model="tempoValue"
            label="Target Tempo"
            type="Number"
            clearable
          ></v-text-field>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import GenreSeedSelect from '@/components/Genre.vue'
import OptionSlider from '@/components/OptionSlider.vue'
import { fetchGenreSeeds } from '@/middleware/fetchGenreSeeds'
import SearchOptionUnit from '@/middleware/SearchOptionUnit'

@Component({
  components: {
    GenreSeedSelect,
    OptionSlider,
  },
})
export default class SearchOption extends Vue {
  private genreSeeds: string[] = []
  private params = [
    new SearchOptionUnit('Danceability', 0, 100, [0, 100]),
    new SearchOptionUnit('Energy', 0, 100, [0, 100]),
    new SearchOptionUnit('Popularity', 0, 100, [0, 100]),
    new SearchOptionUnit('Valence', 0, 100, [0, 100]),
    new SearchOptionUnit('Instrumentalness', 0, 100, [0, 100]),
  ]

  private tempoValue = ''
  private selectedGenre: string[] = []
  private isSearchableGenre = true
  private isSearchabkeTempo = true

  get isSearchableQuery() {
    const tempoReg = new RegExp(/^[0-9]*$/)
    this.isSearchableGenre = this.selectedGenre.length !== 0
    if (this.tempoValue === null) {
      this.tempoValue = ''
    }
    this.isSearchabkeTempo = tempoReg.test(this.tempoValue)
    return this.isSearchableGenre && this.isSearchabkeTempo
  }

  private receiveGenreSeed(value: string[]) {
    this.selectedGenre = value
  }

  async created() {
    this.genreSeeds = await fetchGenreSeeds()
  }

  public resetParam() {
    this.params.map((param) => {
      this.$set(param.range, 0, param.min)
      this.$set(param.range, 1, param.max)
    })
    this.selectedGenre.splice(0, this.selectedGenre.length)
    this.tempoValue = ''
  }

  private setQueryParam(uri: URL, unit: SearchOptionUnit) {
    const max = unit.name === 'Popularity' ? unit.range[1] : unit.range[1] / 100
    const min = unit.name === 'Popularity' ? unit.range[0] : unit.range[0] / 100
    const name = `${unit.name.slice(0, 1).toLowerCase()}${unit.name.slice(1)}`
    uri.searchParams.set(`min_${name}`, String(min))
    uri.searchParams.set(`max_${name}`, String(max))
  }

  public createSearchUri(): string {
    const requestUri = new URL('https://api.spotify.com/v1/recommendations')

    if (!this.isSearchableQuery) {
      return ''
    }
    requestUri.searchParams.set('seed_genres', this.selectedGenre.join(','))
    if (this.tempoValue !== '') {
      requestUri.searchParams.set('target_tempo', String(this.tempoValue))
    }
    this.params.map((param) => {
      this.setQueryParam(requestUri, param)
    })
    return requestUri.href
  }
}
</script>

<style scoped>
@import '@/assets/sass/UnderLine.scss';
</style>
