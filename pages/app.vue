<template>
  <v-row>
    <v-col class="text-center">
      <v-btn>
        {{authRequestUri}}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component} from 'vue-property-decorator'
import {authRequestUri} from '@/plugins/auth'

@Component
export default class TestComponent extends Vue {
  private authRequestUri : string = authRequestUri;
}
</script>
