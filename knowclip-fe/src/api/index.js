import axios from 'axios';

const getClipsEndpoint = 'https://api.twitch.tv/helix/clips'

export const getClips = (auth, limit) => {
  const { channelId } = auth
  const params = {
    broadcaster_id: channelId
  }
  if (limit && limit !== 'No Limit') {
    params.first = parseInt(limit, 10);
  }
  return axios({
    method: 'get',
    url: getClipsEndpoint,
    params,
    headers: {
      'Client-ID': '30th7suthnt9wop5i09l573cj6ptqn'
    }
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.log('Error', err)
  })
}