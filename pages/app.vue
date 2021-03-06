<template>
  <div class="mx-auto" :style="{ 'max-width': '80%', width: '100%' }">
    <v-row>
      <v-col class="text-center">
        <v-btn :href="authUrl" rounded v-if="!isLogined" color="primary"
          >Login with Spotify
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="4" cols="12">
        <v-row>
          <v-col class="pb-0">
            <v-tabs v-model="tab" grow>
              <v-tab href="#Recommend">Recommend</v-tab>
              <v-tab href="#Search">Search</v-tab>

              <v-tab-item value="Recommend">
                <search-option ref="searchOption"></search-option>
              </v-tab-item>
              <v-tab-item value="Search">
                <v-row>
                  <v-col class="pb-0 pt-5">
                    <v-text-field
                      class="pa-0 noneUnderLine"
                      label="Keyword"
                      v-model="keyword"
                      clearable
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pt-0">
            <v-divider class="mx-0"></v-divider>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-row>
              <v-col cols="8">
                <v-btn
                  @click="searchTracks"
                  rounded
                  color="primary"
                  :disabled="!isLogined"
                >
                  <v-icon>mdi-magnify </v-icon> search
                </v-btn>
              </v-col>
              <v-col cols="4">
                <v-btn @click="resetParams" rounded color="primary">
                  <v-icon> mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        md="8"
        cols="12"
        :style="{
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          height: $vuetify.breakpoint.mdAndUp ? '740px' : '',
        }"
      >
        <div v-if="!isLogined">
          <v-icon size="100" class="mx-auto"> mdi-magnify</v-icon>
          <div class="font-weight-bold text-center grey--text text--darken-2">
            <span> PLEASE LOGIN ! </span>
          </div>
        </div>
        <div v-if="(isNotFound || !isSearchableParams) && isLogined">
          <v-icon size="100" class="mx-auto"> mdi-robot-dead</v-icon>
          <div class="font-weight-bold text-center grey--text text--darken-2">
            <span v-if="isNotFound"> NOT FOUND </span>
            <span v-if="!isSearchableParams"> BAD OPTION </span>
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
          v-if="!isFetching && !isNotFound && isSearchableParams && isLogined"
        ></recommended-tracks>
      </v-col>
    </v-row>
    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="12" md="8">
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
import SearchOption from '@/components/SearchOption.vue'
import RecommendedTracks from '@/components/Tracks.vue'
import Track, { fetchRecommendTracks } from '~/plugins/Track'
import { fetchUserProduct } from '@/plugins/fetchUserProduct'
import SpotifyPlayer from '@/components/Player.vue'

@Component({
  components: {
    SearchOption,
    RecommendedTracks,
    SpotifyPlayer,
  },
})
export default class AuthApp extends Vue {
  private isNotFound: boolean = false
  private isSearchableParams: boolean = true
  private tab = 'Recommend'
  private keyword: string | null = null

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

  private resetParams() {
    if (this.tab === 'Recommend') {
      this.$refs.searchOption.resetParam()
    } else {
      this.keyword = null
    }
  }

  private createSearchUri(): string {
    const requestUri = new URL('https://api.spotify.com/v1/search')
    if (this.keyword === null || this.keyword === '') {
      return ''
    }
    requestUri.searchParams.set('q', this.keyword)
    requestUri.searchParams.set('type', 'track')
    return requestUri.href
  }

  private async searchTracks() {
    if (this.tab === 'Recommend') {
      await this.fetchTracks(this.$refs.searchOption.createRecommendUri())
    } else {
      await this.fetchTracks(this.createSearchUri())
    }
  }

  async fetchTracks(requestUri: string) {
    if (this.isFetching === true) return
    this.isFetching = true
    this.isNotFound = false
    this.tracks.splice(0, this.tracks.length)
    if (requestUri !== '') {
      this.isSearchableParams = true
      const tracksRes = await fetchRecommendTracks(requestUri)
      this.tracks = this.tracks.concat(tracksRes)
      if (this.tracks.length === 0) {
        this.isNotFound = true
      }
    } else {
      this.isSearchableParams = false
    }
    this.isFetching = false
  }

  async fetch(): Promise<void> {
    if (userInfoStore.getloginStatus) {
      const ua = window.navigator.userAgent.toLowerCase()
      const userInfoRes = await fetchUserProduct()
      if (
        ua.indexOf('iphone') !== -1 ||
        ua.indexOf('ipad') !== -1 ||
        ua.indexOf('android') !== -1 ||
        userInfoRes !== 'premium'
      ) {
        userInfoStore.setIsPlayerAvailable(false)
      } else {
        userInfoStore.setIsPlayerAvailable(true)
      }
    } else {
      userInfoStore.setIsPlayerAvailable(false)
    }
  }

  async asyncData(
    context: Context
  ): Promise<{
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
    return {
      authUrl: url.href,
    }
  }
}
</script>

<style scoped>
@import '@/assets/sass/UnderLine.scss';
</style>
