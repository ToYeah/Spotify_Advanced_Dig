<template>
  <div>
    <v-row>
      <v-col class="text-center">
        <v-btn :href="authUrl" rounded>Login with Spotify</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <user-profile-card :userProfile="userProfile"> </user-profile-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'
import { Context } from '@nuxt/types'
import { fetchUserProfile } from '@/middleware/fetchUserProfile'
import UserProfileCard from '@/components/UserProfileCard.vue'

@Component({
  components: {
    UserProfileCard,
  },
})
export default class AuthApp extends Vue {
  get token(): string {
    return userInfoStore.getToken
  }

  async asyncData(context: Context): Promise<{}> {
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
    return { userProfile: userProfileRes, authUrl: authUrlRes }
  }
}
</script>
