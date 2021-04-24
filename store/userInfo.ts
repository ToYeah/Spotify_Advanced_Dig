import { Module, VuexModule, Mutation } from 'vuex-module-decorators'

@Module({
  name: 'userInfo',
  stateFactory: true,
  namespaced: true,
})
export default class UserInfo extends VuexModule {
  public token: string = 'hello'
  public get getToken() {
    return this.token
  }
  @Mutation
  public setToken(value: string) {
    this.token = value
  }
}
