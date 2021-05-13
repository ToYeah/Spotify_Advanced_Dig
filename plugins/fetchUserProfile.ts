import { userInfoStore } from '@/store'
import axios from 'axios'

export default class UserProfile {
  constructor(
    public readonly id: string,
    public readonly country: string,
    public readonly display_name: string,
    public readonly email: string,
    public readonly image: string
  ) {}
}

export const fetchUserProfile = async (): Promise<UserProfile> => {
  if (userInfoStore.getloginStatus === false) {
    return new UserProfile('', '', '', '', '')
  } else {
    const profileRes = await axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${userInfoStore.getToken}`,
      },
    })
    const imageRes = await axios.get(profileRes.data.href, {
      headers: {
        Authorization: `Bearer ${userInfoStore.getToken}`,
      },
    })

    const images: { url: string }[] = imageRes.data.images
    const image: string = images[0].url || ''
    return new UserProfile(
      profileRes.data.id,
      profileRes.data.country,
      profileRes.data.display_name,
      profileRes.data.email,
      image
    )
  }
}
