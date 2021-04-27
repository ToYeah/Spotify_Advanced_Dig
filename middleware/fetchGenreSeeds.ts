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
    )
    const res: string[] = genreSeedsRes.data.genres
    return res
  }
}
