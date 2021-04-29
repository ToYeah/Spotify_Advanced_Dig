<template>
  <v-card width="" height="" class="py-">
    <v-row>
      <v-col cols="4">
        <v-img :src="track.image" max-height="200px" contain> </v-img>
      </v-col>
      <v-col cols="">
        <p class="font-weight-bold subtitle-1 grey--text text--darken-2">
          {{ track.name }}
        </p>
        <p class="font-weight-bold grey--text text--darken-2">
          {{ track.artist }}
        </p>
        <v-row>
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
    res.push({ title: 'Valence', value: String(this.track.valence) })
    return res
  }

  @Prop()
  private track!: Track
}
</script>
