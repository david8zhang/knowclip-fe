import axios from 'axios';

const getClipsEndpoint = 'https://api.twitch.tv/helix/clips'

export const getClips = (auth, numClips) => {
  const { channelId } = auth
  return axios({
    method: 'get',
    url: getClipsEndpoint,
    params: {
      broadcaster_id: channelId,
      first: numClips
    },
    headers: {
      'Client-ID': '30th7suthnt9wop5i09l573cj6ptqn'
    }
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('Error', err)
  })
}