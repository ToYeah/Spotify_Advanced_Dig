<template>
  <v-virtual-scroll bench="1" :items="tracks" height="680" item-height="200">
    <template v-slot:default="{ item }">
      <track-card :key="item.id" :track="item"> </track-card>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import Track, { fetchRecommendTracks } from '@/middleware/Track'
import TrackCard from '@/components/TrackCard.vue'

@Component({ components: { TrackCard } })
export default class RecommendedTracks extends Vue {
  @Prop()
  private tracks!: Track[]
}
</script>
