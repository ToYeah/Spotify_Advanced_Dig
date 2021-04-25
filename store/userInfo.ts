import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'userInfo',
  stateFactory: true,
  namespaced: true,
})
export default class UserInfo extends VuexModule {
  private token: string = ''
  private refresh_token: string = ''
  private loginStatus: boolean = false

  public get getToken() {
    return this.token
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
}
