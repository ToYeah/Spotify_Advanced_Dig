<template>
  <v-row>
    <v-col>
      <v-card width="200px">
        <v-row>
          <v-col cols="4">
            <v-img max-height="70" contain :src="nowPlayingStore.image">
            </v-img>
          </v-col>
          <v-col>
            <v-btn color="primary" fab x-small dark outlined>
              <v-icon>mdi-pause</v-icon>
            </v-btn>
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

@Component
export default class SpotifyPlayer extends Vue {
  get nowPlayingStore(): Track {
    return userInfoStore.getNowPlaying
  }

  @Watch('nowPlayingStore')
  updateNowPlaying() {
    console.log('hello')
  }

  mounted() {
    let playerSdkTag = document.createElement('script')
    playerSdkTag.setAttribute('src', 'https://sdk.scdn.co/spotify-player.js')
    document.head.appendChild(playerSdkTag)
  }

  created() {
    if (process.browser) {
      window.onSpotifyWebPlaybackSDKReady = () => {
        const token = `${userInfoStore.getToken}`
        const player = new Spotify.Player({
          name: 'Web Playback SDK Quick Start Player',
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
      }
    }
  }
}
</script>
