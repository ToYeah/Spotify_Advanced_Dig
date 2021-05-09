<template>
  <div>
    <v-row>
      <v-col class="pb-1">
        <div class="grey--text text--darken-1 subtitle-1">
          {{ unit.name }}

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                x-small
                :href="trackUri"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline grey lighten-2">
                {{ unit.name }}
              </v-card-title>

              <v-card-text class="pt-4">
                {{ information }}
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  :href="reference"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  reference
                </v-btn>
                <v-btn color="primary" text @click="dialog = false">
                  CLOSE
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
import SearchOptionUnit, {
  unitInformations,
} from '@/middleware/SearchOptionUnit'

@Component
export default class OptionSlider extends Vue {
  private reference =
    'https://developer.spotify.com/documentation/web-api/reference/'
  private dialog = false

  @Prop()
  private unit!: SearchOptionUnit

  private information = unitInformations[this.unit.name]
}
</script>
