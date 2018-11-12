let express = require('express');
let router = express.Router();

let admin = require('firebase-admin');

let serviceAccount = require('./test-pfacs-d5b5011f97c2')
let researcherList = require("./researcher_list");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://test-pfacs.firebaseio.com"
})

// Add a
router.post("/set_claim", (req, res, next) => {

    // Get the ID token passed.
    const idToken = req.body.idToken;
    // Verify the ID token and decode its payload.

    console.log(idToken)
    try {
        admin.auth().verifyIdToken(idToken.i).then((claims) => {
            console.log("get claim")
            // Verify user is eligible for additional privileges.
            console.log(claims)
            console.log(researcherList)
            try {
                if (typeof claims.email !== 'undefined' &&
                    typeof claims.email_verified !== 'undefined' &&
                    claims.email_verified &&
                    researcherList.includes(claims.email)) {
                    // Add custom claims for additional privileges.
                    admin.auth().setCustomUserClaims(claims.sub, {
                        researcher: true
                    }).then(() => {
                        // Tell client to refresh token on user.
                        console.log("setting claim correctly");
                        res.json({
                            status: 'success'
                        })
                    });
                } else {
                    // Return nothing.
                    console.log("setting claim not correctly");
                    res.json({status: 'ineligible'})
                }
            } catch (e) {
                console.log(e)
            }
        }).catch(console.log);
    } catch (e) {
        console.log(e)
    }
})


module.exports = router;