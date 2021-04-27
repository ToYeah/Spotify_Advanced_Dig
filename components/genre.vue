<template>
  <v-select
    v-model="selected"
    :items="genreSeeds"
    :menu-props="{ maxHeight: '400' }"
    label="Select"
    multiple
    hint="Pick your favorite genres"
  ></v-select>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'nuxt-property-decorator'

@Component
export default class GenreSeedSelect extends Vue {
  private selected: string[] = []

  @Watch('selected')
  validSeedGenresLimit() {
    while (this.selected.length > 5) {
      this.selected.pop()
    }
  }

  @Prop()
  private genreSeeds!: string[]
}
</script>
