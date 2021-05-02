<template>
  <div>
    <v-row>
      <v-col>
        <genre-seed-select
          @selectGenre="receiveGenreSeed"
          :genreSeeds="genreSeeds"
        ></genre-seed-select>
      </v-col>
    </v-row>
    <option-slider :unit="danceability"></option-slider>
    <option-slider :unit="energy"></option-slider>
    <option-slider :unit="popularity"></option-slider>
    <option-slider :unit="valence"></option-slider>
    <option-slider :unit="instrumentalness"></option-slider>
    <v-row>
      <v-col>
        <v-col>
          <v-text-field
            v-model="tempoValue"
            label="Target Tempo"
          ></v-text-field>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import GenreSeedSelect from '@/components/genre.vue'
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
  private danceability = new SearchOptionUnit('Danceability', 0, 100, [0, 100])
  private energy = new SearchOptionUnit('Energy', 0, 100, [0, 100])
  private popularity = new SearchOptionUnit('Popularity', 0, 100, [0, 100])
  private valence = new SearchOptionUnit('Valence', 0, 100, [0, 100])
  private instrumentalness = new SearchOptionUnit('Instrumentalness', 0, 100, [
    0,
    100,
  ])

  private tempoValue = ''
  private selectedGenre: string[] = []
  private isSearchableGenre = true
  private isSearchabkeTempo = true

  get isSearchableQuery() {
    const tempoReg = new RegExp(/^[0-9]*$/)
    this.isSearchableGenre = this.genreSeeds.length !== 0
    this.isSearchabkeTempo = tempoReg.test(this.tempoValue)
    return this.isSearchableGenre && this.isSearchabkeTempo
  }

  private receiveGenreSeed(value: string[]) {
    this.selectedGenre = value
  }

  async created() {
    this.genreSeeds = await fetchGenreSeeds()
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
    this.setQueryParam(requestUri, this.danceability)
    this.setQueryParam(requestUri, this.energy)
    this.setQueryParam(requestUri, this.popularity)
    this.setQueryParam(requestUri, this.valence)
    this.setQueryParam(requestUri, this.instrumentalness)
    return requestUri.href
  }
}
</script>
