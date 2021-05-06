<template>
  <div class="mx-auto" :style="{ 'max-width': '1300px', width: '100%' }">
    <v-row>
      <v-col class="text-center">
        <v-btn :href="authUrl" rounded v-if="!isLogined"
          >Login with Spotify</v-btn
        >
      </v-col>
    </v-row>
    <!--

    <v-row>
      <v-col>
        <h3>{{ token }}</h3>
      </v-col>
    </v-row>
    <user-profile-card :userProfile="userProfile"> </user-profile-card>
-->

    <v-row>
      <v-col cols="4">
        <search-option ref="searchOption"></search-option>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="6">
                <v-btn @click="fetchRecommendedTracks"
                  ><v-icon>mdi-magnify </v-icon> search</v-btn
                >
              </v-col>
              <v-col cols="6">
                <v-btn @click="reset">
                  <v-icon> mdi-refresh</v-icon> <span> reset </span>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="8"
        :style="{
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        }"
      >
        <div v-if="isNotFound">
          <v-icon size="100" class="mx-auto"> mdi-robot-dead</v-icon>
          <div class="font-weight-bold text-center grey--text text--darken-2">
            NOT FOUND
          </div>
        </div>
        <v-progress-circular
          :size="70"
          :width="7"
          color="blue"
          indeterminate
          v-if="isFetching"
        ></v-progress-circular>
        <recommended-tracks
          :tracks="tracks"
          v-if="!isFetching && !isNotFound"
        ></recommended-tracks>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="8">
        <client-only>
          <spotify-player></spotify-player>
        </client-only>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import { Context } from '@nuxt/types'
import UserProfile, { fetchUserProfile } from '@/middleware/fetchUserProfile'
import UserProfileCard from '@/components/UserProfileCard.vue'
import SearchOption from '@/components/SearchOption.vue'
import RecommendedTracks from '@/components/Tracks.vue'
import Track, { fetchRecommendTracks } from '@/middleware/Track'
import SpotifyPlayer from '@/components/Player.vue'

@Component({
  components: {
    UserProfileCard,
    SearchOption,
    RecommendedTracks,
    SpotifyPlayer,
  },
})
export default class AuthApp extends Vue {
  private isNotFound: boolean = false
  get token(): string {
    return userInfoStore.getToken
  }

  get isLogined(): boolean {
    return userInfoStore.getloginStatus
  }

  private tracks: Track[] = []

  private isFetching = false

  $refs!: {
    searchOption: SearchOption
  }

  private reset() {
    this.$refs.searchOption.resetParam()
  }

  async fetchRecommendedTracks() {
    if (this.isFetching === true) return
    this.isFetching = true

    this.isNotFound = false
    this.tracks.splice(0, this.tracks.length)
    const requestUri = this.$refs.searchOption.createSearchUri()
    if (requestUri !== '') {
      const tracksRes = await fetchRecommendTracks(requestUri)
      this.tracks = this.tracks.concat(tracksRes)
      if (this.tracks.length === 0) {
        this.isNotFound = true
      }
    }
    this.isFetching = false
  }

  async asyncData(
    context: Context
  ): Promise<{
    userProfile: UserProfile
    authUrl: string
  }> {
    const { $config } = context
    const url = new URL('https://accounts.spotify.com/authorize')
    const scopes: string[] = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-modify-playback-state',
    ]
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', scopes.join(' '))
    url.searchParams.set('redirect_uri', $config.redirectUri)
    url.searchParams.set('client_id', $config.clientId)
    url.searchParams.set('state', 'state')
    const authUrlRes = url.href
    const userProfileRes = await fetchUserProfile()
    return {
      userProfile: userProfileRes,
      authUrl: authUrlRes,
    }
  }
}
</script>
