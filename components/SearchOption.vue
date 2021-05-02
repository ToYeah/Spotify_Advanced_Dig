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
            v-model="tempo.value"
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

  private tempo = { name: 'tempo', value: '' }

  private selectedGenre: string[] = []

  @Prop()
  private requestUri!: URL

  private receiveGenreSeed(value: string[]) {
    this.selectedGenre = value
  }
  async created() {
    this.genreSeeds = await fetchGenreSeeds()
  }

  @Watch('selectedGenre')
  setGenreSeedsQuery() {
    this.requestUri.searchParams.set(
      'seed_genres',
      this.selectedGenre.join(',')
    )
  }

  @Watch('tempo.value')
  setTargetTempo() {
    this.requestUri.searchParams.set('target_tempo', String(this.tempo.value))
  }

  @Watch('danceability.range')
  setDanceabilityQuery() {
    this.requestUri.searchParams.set(
      'min_danceability',
      String(this.danceability.range[0] / 100)
    )
    this.requestUri.searchParams.set(
      'max_danceability',
      String(this.danceability.range[1] / 100)
    )
  }

  @Watch('energy.range')
  setEnergyQuery() {
    this.requestUri.searchParams.set(
      'min_energy',
      String(this.energy.range[0] / 100)
    )
    this.requestUri.searchParams.set(
      'max_energy',
      String(this.energy.range[1] / 100)
    )
  }

  @Watch('popularity.range')
  setPopularityQuery() {
    this.requestUri.searchParams.set(
      'min_popularity',
      String(this.popularity.range[0])
    )
    this.requestUri.searchParams.set(
      'max_popularity',
      String(this.popularity.range[1])
    )
  }

  @Watch('valence.range')
  setValenceQuery() {
    this.requestUri.searchParams.set(
      'min_valence',
      String(this.valence.range[0] / 100)
    )
    this.requestUri.searchParams.set(
      'max_valence',
      String(this.valence.range[1] / 100)
    )
  }

  @Watch('instrumentalness.range')
  setInstrumentalnessQuery() {
    this.requestUri.searchParams.set(
      'min_instrumentalness',
      String(this.instrumentalness.range[0] / 100)
    )
    this.requestUri.searchParams.set(
      'max_instrumentalness',
      String(this.instrumentalness.range[1] / 100)
    )
  }
}
</script>
