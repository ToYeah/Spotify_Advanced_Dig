<template>
  <v-row class="ma-auto">
    <v-spacer />
    <v-col cols="6">
      <span class="font-weight-bold grey--text text--darken-2 caption"
        >{{ this.title }}:</span
      >
    </v-col>
    <v-col cols="6">
      <span class="font-weight-bold grey--text text--darken-2 caption">{{
        this.value
      }}</span>
    </v-col>
    <v-spacer />
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component({})
export default class TrackPropertyText extends Vue {
  @Prop()
  private title!: string
  @Prop()
  private value!: string
}
</script>
