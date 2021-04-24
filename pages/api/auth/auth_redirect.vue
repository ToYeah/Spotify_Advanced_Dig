<template>
  <v-row>
    <v-col class="text-center">
      <a href="http://localhost:3000/app">hello</a>
      <h1>{{ token }}</h1>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import axios from 'axios'
import { Context } from '@nuxt/types'
import { userInfoStore } from '@/store'

@Component
export default class AuthRedirect extends Vue {
  get token(): string {
    return userInfoStore.getToken
  }

  async asyncData(context: Context): Promise<void> {
    const { $config, query } = context
    const isString = (arg: string | (string | null)[]): arg is string =>
      typeof arg === 'string'
    const redirectUri = 'http://localhost:3000/api/auth/auth_redirect'
    const postParams = new URLSearchParams()
    postParams.set('grant_type', 'authorization_code')
    postParams.set('code', isString(query.code) ? query.code : '')
    postParams.set('redirect_uri', redirectUri)
    const res = await axios
      .post('https://accounts.spotify.com/api/token', postParams, {
        headers: {
          Authorization:
            'Basic ' +
            new Buffer($config.clientId + ':' + $config.clientSecret).toString(
              'base64'
            ),
        },
      })
      .then((res) => {
        userInfoStore.setToken(res.data.access_token)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
