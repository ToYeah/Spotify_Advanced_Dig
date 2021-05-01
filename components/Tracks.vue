<template>
  <v-row>
    <v-col>
      <v-virtual-scroll
        bench="1"
        :items="tracks"
        height="400"
        item-height="200"
      >
        <template v-slot:default="{ item }">
          <track-card :key="item.id" :track="item"> </track-card>
        </template>
      </v-virtual-scroll>
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
