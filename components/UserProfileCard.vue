<template>
  <v-row>
    <v-col>
      <v-card>
        <v-row>
          <v-col cols="6">
            <v-img :src="userProfile.image"></v-img>
          </v-col>
          <v-col>
            <v-row>
              <v-col>UserName：{{ userProfile.display_name }}</v-col>
            </v-row>
            <v-row>
              <v-col> Country: {{ userProfile.country }} </v-col>
            </v-row>
            <v-row
              ><v-col>Email: {{ userProfile.email }}</v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import UserProfile from '~/plugins/fetchUserProfile'

@Component
export default class UserProfileCard extends Vue {
  @Prop()
  private userProfile!: UserProfile
}
</script>
