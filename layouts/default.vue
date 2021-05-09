<template>
  <v-app>
    <v-app-bar app color="primary">
      <h1 class="font-weight-bold white--text subtitle-1">AdvancedDig</h1>
      <v-spacer></v-spacer>
      <v-btn
        x-large
        icon
        color="white"
        href="https://github.com/ToYeah/spotify_search"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component({})
export default class DefaultLayout extends Vue {}
</script>
