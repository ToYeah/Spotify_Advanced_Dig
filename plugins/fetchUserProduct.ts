import { userInfoStore } from '@/store'
import axios from 'axios'

export const fetchUserProduct = async (): Promise<string> => {
  if (userInfoStore.getloginStatus === false) {
    return ''
  } else {
    const userInfoRes = await axios
      .get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${userInfoStore.getToken}`,
        },
      })
      .catch((e) => {
        console.log(e)
        return e.response
      })
    if (userInfoRes.status !== 200) {
      return ''
    }
    return userInfoRes.data.product
  }
}
