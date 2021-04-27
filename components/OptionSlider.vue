<template>
  <v-range-slider
    v-model="unit.range"
    :max="unit.max"
    :min="unit.min"
    hide-details
    class="align-center"
  >
  </v-range-slider>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import SearchOptionUnit from '@/middleware/SearchOptionUnit'

@Component
export default class OptionSlider extends Vue {
  @Prop()
  private unit!: SearchOptionUnit
}
</script>
