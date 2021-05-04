import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import Track, { EmptyTrack } from '@/middleware/Track'

@Module({
  name: 'userInfo',
  stateFactory: true,
  namespaced: true,
})
export default class UserInfo extends VuexModule {
  private token: string = ''
  private refresh_token: string = ''
  private loginStatus: boolean = false
  private deviceId: string = ''
  private nowPlaying: Track = EmptyTrack
  public get getToken() {
    return this.token
  }

  public get getRefreshToken() {
    return this.refresh_token
  }

  public get getloginStatus() {
    return this.loginStatus
  }

  public get getDeviceId() {
    return this.deviceId
  }

  public get getNowPlaying() {
    return this.nowPlaying
  }

  @Mutation
  public setToken(value: string) {
    this.token = value
  }

  @Mutation
  public setRefreshToken(value: string) {
    this.refresh_token = value
  }

  @Mutation
  public setLoginStatus(value: boolean) {
    this.loginStatus = value
  }

  @Mutation
  public setDeviceId(value: string) {
    this.deviceId = value
  }

  @Mutation
  public setNowPlaying(value: Track) {
    this.nowPlaying = value
  }
}
