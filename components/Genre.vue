<template>
  <v-select
    v-model="selectedGenre"
    :items="genreSeeds"
    :menu-props="{ maxHeight: '400' }"
    label="GenreSeed"
    multiple
    hint="Pick your favorite genres"
    clearable="true"
    flat
    class="pa-0 noneUnderLine"
    single-line
  ></v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class GenreSeedSelect extends Vue {
  private selectedGenre: string[] = []

  @Watch('selectedGenre')
  validSeedGenresLimit() {
    while (this.selectedGenre.length > 5) {
      this.selectedGenre.pop()
    }
    this.$emit('selectGenre', this.selectedGenre)
  }

  @Prop()
  private genreSeeds!: string[]
}
</script>

<style scoped>
@import '@/assets/sass/UnderLine.scss';
</style>
