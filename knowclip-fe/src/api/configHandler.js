import { firebase } from './firebase';

export const updateOrCreateConfig = ({ config, broadcasterId }) => {
  const configRef = firebase.database().ref(`config/${broadcasterId}`);
  const newConfig = Object.assign({}, config);
  newConfig.broadcasterId = broadcasterId;
  return configRef.update(newConfig);
};


export const getConfig = (broadcasterId) => {
  const configRef = firebase.database().ref(`config/${broadcasterId}`)
  return configRef.once('value').then((res) => {
    const data = res.val();
    if (!data) {
      return null;
    }
    return data;
  })
}

export const saveFeaturedClips = ({ featuredClipIds, broadcasterId }) => {
  const configRef = firebase.database().ref(`config/${broadcasterId}`)
  return configRef.update({
    featuredClips: featuredClipIds
  })
}

export const saveHiddenClips = ({ hiddenClipIds, broadcasterId }) => {
  const configRef = firebase.database().ref(`config/${broadcasterId}`)
  return configRef.update({
    hiddenClips: hiddenClipIds
  })
}