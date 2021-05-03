<template>
  <div class="mx-auto" :style="{ 'max-width': '1300px', width: '100%' }">
    <v-row>
      <v-col class="text-center">
        <v-btn :href="authUrl" rounded>Login with Spotify</v-btn>
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
        <v-btn @click="fetchRecommendedTracks">search</v-btn>
      </v-col>
      <v-col cols="8">
        <recommended-tracks :tracks="tracks"></recommended-tracks>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
  get token(): string {
    return userInfoStore.getToken
  }

  private tracks: Track[] = []
  private isFetching = false

  $refs!: {
    searchOption: SearchOption
  }
  async fetchRecommendedTracks() {
    if (this.isFetching === true) return
    this.isFetching = true
    this.tracks.splice(0, this.tracks.length)
    const requestUri = this.$refs.searchOption.createSearchUri()
    if (requestUri !== '') {
      const tracksRes = await fetchRecommendTracks(requestUri)
      this.tracks = this.tracks.concat(tracksRes)
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
