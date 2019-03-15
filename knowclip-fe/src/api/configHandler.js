import { endpoints } from './endpoints';
import 'isomorphic-fetch';

export const updateOrCreateConfig = ({ config, broadcasterId, token }) => {
  const getURL = `${endpoints.config}?broadcasterId=${broadcasterId}`
  return fetch(getURL, {
    method: 'GET',
    headers: {
      Authorization: token
    }
  }).then((res) => {
    const existingConfig = res.json();
    const newConfig = config;
    newConfig.broadcasterId = broadcasterId;
    if (!res.ok) {
      return fetch(endpoints.config, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(newConfig)
      }).then((res) => {
        console.log(res.ok);
      }).catch((err) => {
        console.error('Something went wrong during config creation!', err);
      })
    }
    try {
      if (existingConfig) {
        return fetch(endpoints.config, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token
          },
          body: JSON.stringify(newConfig)
        }).then((res) => {
          console.log(res);
        }).catch((err) => {
          console.error('Something went wrong during config update!', err);
        })
      }
    } catch (err) {
      console.error('Something went wrong during response parsing!', err);
    }
  }).catch((err) => {
    console.log(err);
    return null;
  })
};

export const updateFeaturedClips = ({ featuredClips, broadcasterId, token }) => {
  return fetch(`${endpoints.config}/featuredClips`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      'Authorization': token
    },
    body: JSON.stringify({
      featuredClips,
      broadcasterId
    })
  })
}

export const updateHiddenClips = ({ hiddenClips, broadcasterId, token }) => {
  return fetch(`${endpoints.config}/hiddenClips`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      'Authorization': token
    },
    body: JSON.stringify({
      hiddenClips,
      broadcasterId
    })
  })
}

export const getConfig = (broadcasterId, token) => {
  return fetch(`${endpoints.config}?broadcasterId=${broadcasterId}`, {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  })
    .then((res) => {
      if (!res.ok) {
        return null;
      } else {
        try {
          return res.json();
        } catch (err) {
          console.error('Something went wrong during response parsing');
        }
      }
    }).catch((err) => {
      console.error('Something went wrong during fetch!', err);
    })
}