import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAPf4A30H7HlFE6yNSg-_8aFGrY6VCrBig",
    authDomain: "nowornever-89f94.firebaseapp.com",
    databaseURL: "https://nowornever-89f94.firebaseio.com",
    projectId: "nowornever-89f94",
    storageBucket: "nowornever-89f94.appspot.com",
    messagingSenderId: "183042376104"
};
var fire = firebase.initializeApp(config);
export default fire;