<template>
  <v-row>
    <v-col>
      <track-card v-for="item in tracks" :key="item.id" :track="item">
      </track-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import UserProfile from '@/middleware/fetchUserProfile'
import Track, { fetchRecommendTracks } from '@/middleware/Track'
import TrackCard from '@/components/TrackCard.vue'

@Component({ components: { TrackCard } })
export default class RecommendedTracks extends Vue {
  @Prop()
  private tracks!: Track[]
}
</script>
