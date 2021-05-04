<template>
  <v-card class="py-2" outlined height="200">
    <v-row>
      <v-col cols="4">
        <v-img :src="track.image" max-height="176px" max-width="200px" contain>
        </v-img>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="10">
            <v-row>
              <v-col class="pb-0">
                <div
                  class="font-weight-bold grey--text text--darken-2 subtitle-1"
                  :class="$style.CardText"
                >
                  {{ track.name }}
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col class="pt-1">
                <div
                  class="font-weight-bold grey--text text--darken-2 subtitle-2"
                  :class="$style.CardText"
                >
                  {{ track.artist }}
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="2" class="px-0 pt-4">
            <v-btn
              color="primary"
              fab
              x-small
              dark
              outlined
              class="mt-1"
              @click="playBackMusic"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              fab
              x-small
              dark
              outlined
              :href="trackUri"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-0">
            <v-divider class="mx-4"></v-divider>
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
import axios from 'axios'
import { userInfoStore } from '~/store'

@Component({ components: { TrackPropertyText } })
export default class TrackCard extends Vue {
  get properties(): { title: string; value: string }[] {
    const res: { title: string; value: string }[] = []
    res.push({ title: 'Danceability', value: String(this.track.danceability) })
    res.push({ title: 'Energy', value: String(this.track.energy) })
    res.push({ title: 'Tempo', value: String(this.track.tempo) })
    res.push({ title: 'Valence', value: String(this.track.valence) })
    res.push({
      title: 'Instrumentalness',
      value: String(this.track.instrumentalness),
    })
    res.push({ title: 'Popularity', value: String(this.track.popularity) })
    return res
  }

  private async playBackMusic() {
    const requestUri = new URL('https://api.spotify.com/v1/me/player/play')
    requestUri.searchParams.set('device_id', userInfoStore.getDeviceId)
    const body: { uris: string[] } = {
      uris: [`spotify:track:${this.track.id}`],
    }
    const res = await axios.put(requestUri.href, body, {
      headers: {
        Authorization: `Bearer ${userInfoStore.getToken}`,
      },
    })
    userInfoStore.setNowPlaying(this.track)
  }

  @Prop()
  private track!: Track

  get trackUri(): string {
    return `https://open.spotify.com/track/${this.track.id}`
  }
}
</script>

<style module>
@import '@/assets/sass/CardText.scss';
</style>
