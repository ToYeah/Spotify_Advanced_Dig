<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col class="py-1" cols="7">
          <div class="font-weight-bold grey--text text--darken-2 caption">
            {{ this.title }}:
          </div>
        </v-col>
        <v-col cols="5" class="py-1">
          <div class="font-weight-bold grey--text text--darken-2 caption">
            {{ this.value }}
          </div>
        </v-col>
      </v-row>
      <v-row> </v-row>
    </v-col>
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
