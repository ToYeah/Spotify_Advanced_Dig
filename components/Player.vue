<template>
  <v-row>
    <v-col>
      <v-card outlined>
        <v-row justify="center" align="center">
          <v-col cols="4">
            <v-img max-height="100px" contain :src="nowPlayingTrack.image">
            </v-img>
          </v-col>
          <v-col cols="8">
            <v-row>
              <v-col cols="8">
                <v-row>
                  <v-col class="pb-0">
                    <div
                      class="font-weight-bold grey--text text--darken-2 subtitle-1"
                      :class="$style.CardText"
                    >
                      {{ nowPlayingTrack.name }}
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="py-0">
                    <div
                      class="font-weight-bold grey--text text--darken-2 subtitle-2"
                      :class="$style.CardText"
                    >
                      {{ nowPlayingTrack.artist }}
                    </div>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="4">
                <v-row justify="center" align="center">
                  <v-spacer></v-spacer>
                  <v-col cols="4" class="px-0 pt-6 pb-0">
                    <v-btn
                      color="primary"
                      fab
                      x-small
                      dark
                      outlined
                      @click="togglePlay"
                    >
                      <v-icon v-show="!isPlaying">mdi-play</v-icon>
                      <v-icon v-show="isPlaying">mdi-pause</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="px-0 pt-6 pb-0">
                    <v-btn
                      color="primary"
                      fab
                      x-small
                      dark
                      outlined
                      @click="togglePlay"
                    >
                      <v-icon>mdi-volume-high</v-icon>
                    </v-btn>
                  </v-col>
                  <v-spacer></v-spacer>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col> <seek-bar ref="seekBar"></seek-bar></v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import Track from '~/middleware/Track'
import axios from 'axios'
import SeekBar from '@/components/SeekBar.vue'

@Component({ components: { SeekBar } })
export default class SpotifyPlayer extends Vue {
  private isPlaying: boolean = false

  get nowPlayingTrack(): Track {
    return userInfoStore.getNowPlaying
  }

  get player() {
    return userInfoStore.getPlayer
  }

  $refs!: {
    seekBar: SeekBar
  }

  private async togglePlay() {
    const stateRes = await this.player?.getCurrentState()
    if (stateRes === null || stateRes?.paused === undefined) return
    await this.player?.togglePlay()
    this.isPlaying = stateRes?.paused
  }

  private async updateIsPlaying() {
    const stateRes = await this.player?.getCurrentState()
    this.isPlaying = !stateRes?.paused
  }

  @Watch('isPlaying')
  updateSeekBar() {
    if (this.isPlaying) {
      this.$refs.seekBar.startMonitoring()
    } else {
      this.$refs.seekBar.finishMonitoring()
    }
  }

  @Watch('nowPlayingTrack')
  async updateNowPlaying() {
    this.updateIsPlaying()
  }

  mounted() {
    let playerSdkTag = document.createElement('script')
    playerSdkTag.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.head.appendChild(playerSdkTag)

    if (process.browser) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = `${userInfoStore.getToken}`
        const player = new Spotify.Player({
          name: 'SpotifyOptionSearch',
          getOAuthToken: (cb) => {
            cb(token)
          },
          volume: 0.15,
        })

        // Error handling
        player.addListener('initialization_error', ({ message }) => {
          console.error(message)
        })
        player.addListener('authentication_error', ({ message }) => {
          console.error(message)
        })
        player.addListener('account_error', ({ message }) => {
          console.error(message)
        })
        player.addListener('playback_error', ({ message }) => {
          console.error(message)
        })

        // Playback status updates
        player.addListener('player_state_changed', (state) => {
          console.log(state)
        })

        // Ready
        player.addListener('ready', ({ device_id }) => {
          console.log('Device Ready')
          userInfoStore.setDeviceId(device_id)
        })

        // Not Ready
        player.addListener('not_ready', ({ device_id }) => {
          console.log('Device ID has gone offline', device_id)
        })

        // Connect to the player!
        player.connect()

        userInfoStore.setPlayer(player)
      }
    }
  }
}
</script>

<style module>
@import '@/assets/sass/CardText.scss';
</style>
