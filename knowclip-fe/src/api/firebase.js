import firebase from 'firebase';
var config = {
  apiKey: 'AIzaSyCSQjPTzOyNKW7GiV3fu7DwtyOfb1bqqRs',
  authDomain: 'twitch-hackathon-55882.firebaseapp.com',
  databaseURL: 'https://twitch-hackathon-55882.firebaseio.com',
  projectId: 'twitch-hackathon-55882',
  storageBucket: 'twitch-hackathon-55882.appspot.com',
  messagingSenderId: '84835985605'
};
firebase.initializeApp(config);

export { firebase };
