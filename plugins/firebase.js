import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyAW_SPBUQ5Y1XFwnc8rc_uIelkvj7e1AY4',
  authDomain: 'dev14-f1c40.firebaseapp.com',
  databaseURL: 'https://dev14-f1c40.firebaseio.com',
  projectId: 'dev14-f1c40',
  storageBucket: '',
  messagingSenderId: '882165728062',
  appId: '1:882165728062:web:4d933d267ba21341'
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
