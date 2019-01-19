import { firebase } from './firebase';

export const updateOrCreateConfig = ({ config, broadcasterId }) => {
  const configRef = firebase.database().ref('config');
  const newConfig = Object.assign({}, config);
  newConfig.broadcasterId = broadcasterId;
  return configRef.update({
    [broadcasterId]: newConfig
  });
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
