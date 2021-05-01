<template>
  <div>
    <v-row>
      <v-col> {{ propertyName }}</v-col>
    </v-row>
    <v-row>
      <v-col>
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
