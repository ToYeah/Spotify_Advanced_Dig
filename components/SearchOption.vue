<template>
  <div>
    <v-row>
      <v-col>
        <genre-seed-select :genreSeeds="genreSeeds"></genre-seed-select>
      </v-col>
    </v-row>
    <option-slider :unit="danceability"></option-slider>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
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
  private danceability = new SearchOptionUnit(0, 140, [0, 140])

  async created() {
    this.genreSeeds = await fetchGenreSeeds()
  }
}
</script>
