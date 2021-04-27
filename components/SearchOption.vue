<template>
  <div>
    <v-row>
      <v-col>
        <genre-seed-select :genreSeeds="genreSeeds"></genre-seed-select>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import GenreSeedSelect from '@/components/genre.vue'
import { fetchGenreSeeds } from '~/middleware/fetchGenreSeeds'

@Component({
  components: {
    GenreSeedSelect,
  },
})
export default class SearchOption extends Vue {
  private genreSeeds: string[] = []

  async created() {
    this.genreSeeds = await fetchGenreSeeds()
  }
}
</script>
