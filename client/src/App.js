import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { GoogleLogin } from 'react-google-login';
import firebase from 'firebase';
import ResearcherDashboard from './researcher_dashboard'
import 'semantic-ui-css/semantic.min.css';
import {Container} from 'semantic-ui-react'

let config = {
        apiKey: "AIzaSyAbY4nV71yiRKOo83KAv0c2xm-IV5fmH6k",
        authDomain: "test-pfacs.firebaseapp.com",
        databaseURL: "https://test-pfacs.firebaseio.com",
        projectId: "test-pfacs",
        storageBucket: "test-pfacs.appspot.com",
        messagingSenderId: "908046556011"
    };
firebase.initializeApp(config);

class App extends Component {
    state = {user: null, firebase_credential: null, email: "", password: "", message: "", firebase_login: false, firebase_token_id: "", data: {}
                , course_list: null, failure: false }

    componentDidMount() {
        // fetch('/users')
        //     .then(res => res.json() )
        //     .then(users => this.setState({ users }));
    }

    print_firebase_logs = () =>{
        // axios.post('/users/read_all_data', {access_token: this.state.firebase_token_id })
        //      .then(res=> {
        //          if (res.data.code === 0){
        //              console.log(res.data);
        //             this.setState({data: JSON.stringify(res.data.data)})
        //          }
        //      })
        console.log("getting firebase log")
        // let ref = firebase.database().ref(`/users/${firebase.auth().currentUser.uid}`);
        let ref = firebase.database().ref(`/users/`).limitToFirst(4);
        ref.on("value", snapshot =>{
                let data = snapshot.val();
                console.log(data);
                this.setState({data: data})
                // res.json({code: 0, data: snapshot.val()})
            },
            error => {
                console.log("there is an error: " + error)
                // res.json({code:1})
            }

        )
    };

    erase_data = () =>{
        this.setState({data: null})
    }

    get_student_emails = (c) =>{
        axios.post('/users/read_specific_course', {access_token: this.state.googleClassroomToken, course_id: c.id,
                                                    course_name: c.name})
            .then(res => {
                    console.log(res)
            }).catch( e => {console.log(e)})
    };


    create_course_button = (course_list) => {
        if (course_list === null){
            return (<div/>)
        }
        return course_list.map(c => {
                return (<button type="button" className="btn btn-secondary"
                                onClick={() => this.get_student_emails(c)}> {c.name} </button>)
            }
        )
    };

    access_through_service_account = ()=>{
        axios.post("/service_account/access").then(console.log)
            .catch(console.log)
    }


    googleResponse = (response) =>{
        console.log(response)

        this.setState(
            {
                googleClassroomToken: response.accessToken
            }
        )
        this.get_student_emails({id:"18289786937"})
        axios.post('/users/googlelogin', {access_token:this.state.googleClassroomToken})
            .then(res =>{
                console.log("Google login success" + res);
                if (res.data.code === 0){
                    this.setState({message: "google classroom log in success", course_list: res.data.course_list});
                    console.log(res.data.course_list)
                }
                else{
                    this.setState({message: "failure"})
                }
            })
            .catch(e => console.log(e))
    }

    firebaseResponse = (response) =>{
        console.log(response);

        // this.setState({firebase_token_id: response.accessToken});
        this.setState({firebase_token_id: response.tokenId, user: response, email: response.profileObj.email});


        let credential = firebase.auth.GoogleAuthProvider.credential(response.tokenId);
        console.log("hello")
        try {
            firebase.auth().signInAndRetrieveDataWithCredential(credential)
                .then(credential => {
                    console.log("getting credential")
                    console.log(credential.user.uid);
                    // set up uid
                    this.setState({firebase_credential:credential});
                    axios.post('/admin_test/set_claim', {idToken: firebase.auth().currentUser.getIdToken()})
                        .then(res=>{
                        console.log("setting claim response")
                        if (res.data.status === "success"){
                            // firebase.auth().currentUser.getIdToken(true)
                            //     .then(token_id => {
                            //         this.setState({firebase_token_id: token_id});
                            //         console.log("the token has been refreshed")
                            //         console.log(firebase.auth().currentUser)
                            //
                            //     })
                            //     .catch(console.log);

                            firebase.auth().currentUser.getIdTokenResult(true)
                                .then(token => console.log(token))
                            this.setState({failure: false})

                        }else{
                            firebase.auth().currentUser.getIdTokenResult(true)
                                .then(token => console.log(token))
                            this.setState({failure: true})


                            console.log(res.data.status)
                        }
                    })
                })
                .catch(function(error) {
                    // Handle Errors here.
                    let errorCode = error.code;
                    let errorMessage = error.message;
                    // The email of the user's account used.
                    let email = error.email;
                    // The firebase.auth.AuthCredential type that was used.
                    let credential = error.credential;

                    // ...
                    console.log("error: " + error);
                });
        }catch (e) {
            console.log(e)
        }




        //
        // axios.post('/users/firebase_login', {access_token:this.state.firebase_token_id})
        //     .then(res =>{
        //         console.log(res)
        //
        //         if (res.data.code === 0){
        //             this.setState({message: "firebase log in success", firebase_login: true})
        //             }
        //         else{
        //             this.setState({message: "failure"})
        //         }
        //
        //
        //     })
        //     .catch(e => console.log(e));
        // // axios.get('/users')
        //     .then((res) => console.log(res));
        // console.log(this.state.firebase_token_id)
        // axios.get("https://classroom.googleapis.com/v1/courses", {headers:
        //         {"Application": "Bearer " + this.state.firebase_token_id}})
        //     .then(e=> console.log(e))

    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    };

    handlePasswordChange = (e) =>{
        this.setState({password: e.target.value})
    }


    handleSubmit = (e)=>{
        e.preventDefault()
    }

    render() {
        return (
            <div className="App">

                <GoogleLogin
                    clientId="908046556011-80kbve0btf4nnn1o4vd010a0ag59tfj5.apps.googleusercontent.com"
                    scope="https://www.googleapis.com/auth/firebase"
                    onSuccess={this.firebaseResponse}
                    onFailure={this.firebaseResponse}
                >  Firebase Login </GoogleLogin>


                {/*<GoogleLogin*/}
                    {/*clientId="908046556011-80kbve0btf4nnn1o4vd010a0ag59tfj5.apps.googleusercontent.com"*/}
                    {/*// scope="https://www.googleapis.com/auth/classroom.courses.readonly"*/}
                    {/*scope = "https://www.googleapis.com/auth/classroom.courses*/}
                    {/*https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.profile.emails"*/}
                    {/*onSuccess={this.googleResponse}*/}
                    {/*onFailure={this.googleResponse}*/}
                {/*>  Google classroom Login </GoogleLogin>*/}

                <button type="button" className="btn btn-primary" onClick={this.access_through_service_account}> Service account login</button>

                {  this.state.message !== "" ? <div className="alert alert-primary" role="alert"> {this.state.message } </div>  : <div/> }
                {this.create_course_button(this.state.course_list)}
                <button type="button" className="btn btn-primary" onClick={this.print_firebase_logs}> Read data </button>
                <button type="button" className="btn btn-secondary" onClick={this.erase_data}> Erase data </button>

                <Container  text> {
                    this.state.email === "" ?
                        "No log in right now" :
                        `Current user: ${this.state.email}`

                }  </Container>

                { this.state.failure ? <Container text> This account is not a research account  </Container> : <div></div> }

                <div className="alert alert-primary" role="alert">
                    {
                        Object.keys(this.state.data).length === 0 ? "No data" : "data received"
                    }
                </div>
                <ResearcherDashboard data={this.state.data}/>
            </div>

        );
    }
}

export default App;
