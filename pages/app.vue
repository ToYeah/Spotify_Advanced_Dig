<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <v-btn :href="authUrl" rounded>Login with Spotify</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h3>{{ token }}</h3>
      </v-col>
    </v-row>
    <user-profile-card :userProfile="userProfile"> </user-profile-card>
    <search-option :requestUri="requestUri"></search-option>
    <v-btn @click="fetchRecommendedTracks">search</v-btn>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import { Context } from '@nuxt/types'
import UserProfile, { fetchUserProfile } from '@/middleware/fetchUserProfile'
import UserProfileCard from '@/components/UserProfileCard.vue'
import SearchOption from '@/components/SearchOption.vue'
import { fetchGenreSeeds } from '~/middleware/fetchGenreSeeds'
import axios from 'axios'

@Component({
  components: {
    UserProfileCard,
    SearchOption,
  },
})
export default class AuthApp extends Vue {
  private requestUri: URL = new URL(
    'https://api.spotify.com/v1/recommendations'
  )

  get token(): string {
    return userInfoStore.getToken
  }

  async fetchRecommendedTracks() {
    const res = await axios.get(this.requestUri.href, {
      headers: {
        Authorization: `Bearer ${userInfoStore.getToken}`,
      },
    })
    console.log(res.data)
  }

  async asyncData(
    context: Context
  ): Promise<{
    userProfile: UserProfile
    authUrl: string
  }> {
    const { $config } = context
    const url = new URL('https://accounts.spotify.com/authorize')
    const scopes: string[] = ['user-read-private', 'user-read-email']
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
