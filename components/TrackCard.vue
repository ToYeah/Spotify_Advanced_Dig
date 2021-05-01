<template>
  <v-card class="py-2" outlined>
    <v-row>
      <v-col cols="4">
        <v-img :src="track.image" max-height="200px" max-width="200px" contain>
        </v-img>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col class="pb-0">
            <div class="font-weight-bold grey--text text--darken-2 subtitle-1">
              {{ track.name }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-1">
            <div class="font-weight-bold grey--text text--darken-2 subtitle-2">
              {{ track.artist }}
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-0">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-row class="py-3">
          <v-col>
            <track-property-text
              v-for="item in properties.slice(0, 3)"
              :key="item.title"
              :title="item.title"
              :value="item.value"
            >
            </track-property-text>
          </v-col>
          <v-col>
            <track-property-text
              v-for="item in properties.slice(3, 6)"
              :key="item.title"
              :title="item.title"
              :value="item.value"
            >
            </track-property-text>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Track from '~/middleware/Track'
import TrackPropertyText from '@/components/TrackPropertyText.vue'

@Component({ components: { TrackPropertyText } })
export default class TrackCard extends Vue {
  get properties(): { title: string; value: string }[] {
    const res: { title: string; value: string }[] = []
    res.push({ title: 'Danceability', value: String(this.track.danceability) })
    res.push({ title: 'Energy', value: String(this.track.energy) })
    res.push({ title: 'Tempo', value: String(this.track.tempo) })
    res.push({ title: 'Acousticness', value: String(this.track.acousticness) })
    res.push({ title: 'Loudness', value: String(this.track.loudness) })
    res.push({ title: 'Popularity', value: String(this.track.popularity) })
    return res
  }

  @Prop()
  private track!: Track
}
</script>
