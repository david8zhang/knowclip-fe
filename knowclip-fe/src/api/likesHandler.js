import { endpoints } from './endpoints';
import 'isomorphic-fetch';

export const addLike = (params) => {
  const { broadcasterId, userId, clipId, token } = params;
  return fetch(endpoints.like, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      broadcasterId,
      userId,
      clipId
    })
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.error(err);
  })
}

export const revokeLike = (params) => {
  const { broadcasterId, userId, clipId, token } = params;
  return fetch(`${endpoints.like}/revoke`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      broadcasterId,
      userId,
      clipId
    })
  }).then((res) => {
    return res;
  }).catch((err) => {
    console.error(err);
  })
}

export const fetchLikes = (broadcasterId, token) => {
  return fetch(`${endpoints.multiLikes}?broadcasterId=${broadcasterId}`, {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }).then((res) => {
    return res.json();
  }).catch((err) => {
    console.error(err);
  })
}