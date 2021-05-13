<template></template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'

@Component
export default class AuthRedirect extends Vue {
  created() {
    this.$router.push('/app')
  }
}
</script>
