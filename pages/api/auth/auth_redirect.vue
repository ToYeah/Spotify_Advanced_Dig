<template></template>

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

  async fetch(context: Context): Promise<void> {
    const { $config, query, error } = context
    const isString = (arg: string | (string | null)[]): arg is string =>
      typeof arg === 'string'
    const postParams = new URLSearchParams()
    postParams.set('grant_type', 'authorization_code')
    postParams.set('code', isString(query.code) ? query.code : '')
    postParams.set('redirect_uri', $config.redirectUri)
    await axios
      .post('https://accounts.spotify.com/api/token', postParams, {
        headers: {
          Authorization:
            'Basic ' +
            Buffer.from($config.clientId + ':' + $config.clientSecret).toString(
              'base64'
            ),
        },
      })
      .then((res) => {
        userInfoStore.setToken(res.data.access_token)
        userInfoStore.setRefreshToken(res.data.refresh_token)
        userInfoStore.setLoginStatus(true)
      })
      .catch((err) => {
        error({ statusCode: 404 })
      })
  }

  created() {
    this.$router.push('/app')
  }
}
</script>
