import { userInfoStore } from '@/store'
import axios from 'axios'

export default class Track {
  constructor(
    public readonly artist: string,
    public readonly image: string,
    public readonly name: string,
    public readonly id: string,
    public readonly tempo: number,
    public readonly danceability: number,
    public readonly energy: number,
    public readonly valence: number,
    public readonly popularity: number,
    public readonly liveness: number,
    public readonly instrumentalness: number
  ) {}
}

export const EmptyTrack: Track = new Track('', '', '', '', 0, 0, 0, 0, 0, 0, 0)

export const fetchRecommendTracks = async (
  requestUri: string
): Promise<Track[]> => {
  if (userInfoStore.getloginStatus === false) {
    return []
  } else {
    const recommendTracksRes = await axios.get(requestUri, {
      headers: {
        Authorization: `Bearer ${userInfoStore.getToken}`,
      },
    }).catch((e) => {
      console.log(e)
      return e.response
    })
    if (recommendTracksRes.status !== 200)
    {
      return []
    }
    let trackRes = recommendTracksRes.data.tracks
    if ('items' in trackRes) {
      trackRes = trackRes.items
    }
    console.log(recommendTracksRes)
    const trackAry: Track[] = await Promise.all(
      trackRes.map(
        async (track: {
          id: string
          album: { images: { url: string }[] }
          artists: { name: string }[]
          name: string
        }): Promise<Track> => {
          const featureRes = await axios.get(
            `https://api.spotify.com/v1/audio-features/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${userInfoStore.getToken}`,
              },
            }
          ).catch((e) => {
            console.log(e)
            return e.response
          })
          const trackInfoRes = await axios.get(
            `https://api.spotify.com/v1/tracks/${track.id}`,
            {
              headers: {
                Authorization: `Bearer ${userInfoStore.getToken}`,
              },
            }
          ).catch((e) => {
            console.log(e)
            return e.response
          })
          if (trackInfoRes.status !== 200 || featureRes.status !== 200)
          {
            return EmptyTrack
          }
          const artistNames = track.artists.map((x) => x.name)
          const trackRes = new Track(
            artistNames.join(', '),
            track.album.images[0].url,
            track.name,
            track.id,
            featureRes.data.tempo,
            featureRes.data.danceability,
            featureRes.data.energy,
            featureRes.data.valence,
            trackInfoRes.data.popularity,
            featureRes.data.liveness,
            featureRes.data.instrumentalness
          )
          return trackRes
        }
      )
    )
    return trackAry
  }
}
