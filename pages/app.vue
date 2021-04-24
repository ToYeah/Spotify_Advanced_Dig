<template>
  <v-row>
    <v-col class="text-center">
      <a :href="authUrl">{{ authUrl }}</a>
      <h1>{{ token }}</h1>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'

@Component
export default class AuthApp extends Vue {
  get token(): string {
    return userInfoStore.getToken
  }

  get authUrl() {
    const url = new URL('https://accounts.spotify.com/authorize')
    const scopes: string[] = ['user-read-private', 'user-read-email']
    const redirectUri: string = 'http://localhost:3000/api/auth/auth_redirect'

    url.searchParams.set('response_type', 'code')
    url.searchParams.set('scope', scopes.join(' '))
    url.searchParams.set('redirect_uri', redirectUri)
    url.searchParams.set('client_id', this.$config.clientId)
    url.searchParams.set('state', 'state')
    console.log(url.href)
    return url.href
  }
  created() {
    console.log(userInfoStore.getToken)
  }
}
</script>
