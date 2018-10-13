var express = require('express');
var router = express.Router();

const {google} = require('googleapis');
let firebase = require('firebase')
let config = {
    apiKey: "AIzaSyAbY4nV71yiRKOo83KAv0c2xm-IV5fmH6k",
    authDomain: "test-pfacs.firebaseapp.com",
    databaseURL: "https://test-pfacs.firebaseio.com",
    projectId: "test-pfacs",
    storageBucket: "test-pfacs.appspot.com",
    messagingSenderId: "908046556011"
};
firebase.initializeApp(config);

const oauth2Client = new google.auth.OAuth2(
    "908046556011-80kbve0btf4nnn1o4vd010a0ag59tfj5.apps.googleusercontent.com",
    "CkYb1krcXHeMzlfcjtwP2pX9",
    "www.wisc.edu"
);

// generate a url that asks permissions for Google+ and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/firebase',
];

const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',

    // If you only need one scope you can pass it as a string
    scope: scopes
});


function get_google_class (access_token, res1){
    console.log("hello")
    let OAuth2 = google.auth.OAuth2;
    let auth = new OAuth2();
    auth.setCredentials({access_token: access_token});
    let classroom = google.classroom({version: 'v1', auth});

    classroom.courses.list({
        pageSize: 10,
    }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);
        const courses = res.data.courses;
        if (courses && courses.length) {
            console.log('Courses:');
            courses.forEach((course) => {
                console.log(`${course.name} (${course.id})`);
            });

            res1.json(courses)
        } else {
            console.log('No courses found.');
            res1.json({status:"failure"})
        }
    });

}

function get_data_from_firebase(access_token, res){
    let credential = firebase.auth.GoogleAuthProvider.credential(access_token);
    console.log(credential)

    try {
        firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
            // Handle Errors here.
            let errorCode = error.code;
            let errorMessage = error.message;
            // The email of the user's account used.
            let email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            let credential = error.credential;
            // ...
            console.log("error: " + error);
            res.json("error occured")
        });
    }catch (e) {
        console.log(e)
    }


    //let db = firebase.database()
    res.json("success")
    // Not continuous data, need to use listener
    // db.ref("/users").once('value').then(snapshot => {
    //     console.log(snapshot)
    //     //let username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    //     res.json("success")
    // }).catch(error => {
    //     console.json(error);
    //     res.json("error");
    // })
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    // Comment out this line:
    //res.send('respond with a resource');

    // And insert something like this instead:
    res.json([{
        id: 1,
        username: "samsepi0l"
    }, {
        id: 2,
        username: "D0loresH4ze"
    }]);
});

router.post('/googlelogin',  (req, res, next)=>{
    // Account_info
    // {username:"", password:""}
    console.log("google log in");
    let account_info = req.body;
    let access_token = account_info.access_token;
    get_google_class(access_token, res);
    console.log("getting google classes");
});

router.post('/firebase_login',  (req, res, next)=>{
    // Account_info
    // {username:"", password:""}
    console.log("firebase log in");
    let account_info = req.body;
    let access_token = account_info.access_token;
    get_data_from_firebase(access_token, res);

    console.log("access_token"  + access_token);
    console.log("firebase login success");
   // await oauth2Client.getAccessToken();

});





module.exports = router;