<template>
  <v-row>
    <v-col>
      <v-slider
        :max="duration"
        v-model="position"
        @change="setSeekPosition"
        @mousedown="mouseDown"
        @mouseup="mouseUp"
      >
      </v-slider>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { userInfoStore } from '@/store'

@Component
export default class SeekBar extends Vue {
  private timeOut?: NodeJS.Timeout
  private duration: number = 1
  private position: number = 0
  private isMouseDown: boolean = false

  get player() {
    return userInfoStore.getPlayer
  }

  private mouseDown() {
    this.isMouseDown = true
  }
  private mouseUp() {
    this.isMouseDown = false
  }
  private async setSeekPosition() {
    if (this.position === 0) {
      this.position = 0.0001
    }
    this.player?.seek(this.position)
  }

  public async startMonitoring() {
    this.timeOut = setInterval(async () => {
      const res = await this.player?.getCurrentState()
      res
      if (res !== null && res !== undefined) {
        this.duration = res.duration
        if (res?.position !== undefined && !this.isMouseDown) {
          this.position = res.position
        }
      }
    }, 100)
  }

  public finishMonitoring() {
    if (this.timeOut !== undefined) {
      clearInterval(this.timeOut)
    }
  }
}
</script>
