import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import UserInfo from '@/store/userInfo'

let userInfoStore: UserInfo

function initialiseStores(store: Store<any>): void {
  userInfoStore = getModule(UserInfo, store)
}

export { initialiseStores, userInfoStore }
