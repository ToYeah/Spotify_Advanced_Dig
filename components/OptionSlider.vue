<template>
  <div>
    <v-row>
      <v-col class="pb-1">
        <div class="font-weight-bold grey--text text--darken-2 subtitle-1">
          {{ unit.name }}
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-1 px-4">
        <v-range-slider
          v-model="unit.range"
          :max="unit.max"
          :min="unit.min"
          hide-details
          class="align-center"
        >
        </v-range-slider>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import SearchOptionUnit from '@/middleware/SearchOptionUnit'

@Component
export default class OptionSlider extends Vue {
  @Prop()
  private unit!: SearchOptionUnit
  @Prop()
  private propertyName!: string
}
</script>
