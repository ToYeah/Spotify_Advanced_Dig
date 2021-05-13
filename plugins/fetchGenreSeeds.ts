import { userInfoStore } from '@/store'
import axios from 'axios'

export const fetchGenreSeeds = async (): Promise<string[]> => {
  if (userInfoStore.getloginStatus === false) {
    return []
  } else {
    const genreSeedsRes = await axios.get(
      'https://api.spotify.com/v1/recommendations/available-genre-seeds',
      {
        headers: {
          Authorization: `Bearer ${userInfoStore.getToken}`,
        },
      }
    ).catch((e) => {
      console.log(e)
      return e.response
    })
    if (genreSeedsRes.status !== 200)
    {
      return []
    }
    const res: string[] = genreSeedsRes.data.genres
    return res
  }
}
