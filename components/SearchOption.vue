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
    <option-slider
      propertyName="Dancceability"
      :unit="danceability"
    ></option-slider>
    <option-slider propertyName="Energy" :unit="energy"></option-slider>
    <option-slider propertyName="popularity" :unit="popularity"></option-slider>
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
  private danceability = new SearchOptionUnit(0, 100, [0, 100])
  private energy = new SearchOptionUnit(0, 100, [0, 100])
  private popularity = new SearchOptionUnit(0, 100, [0, 100])
  private selectedGenre: string[] = []
  @Prop()
  private requestUri!: URL

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
  private receiveGenreSeed(value: string[]) {
    this.selectedGenre = value
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
}
</script>
