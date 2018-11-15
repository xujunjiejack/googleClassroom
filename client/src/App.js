import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { GoogleLogin } from 'react-google-login';


class App extends Component {
    state = {users: [], email: "", password: "", message: "", firebase_login: false, firebase_token_id: "", data: null
                , course_list: null}

    componentDidMount() {
        // fetch('/users')
        //     .then(res => res.json() )
        //     .then(users => this.setState({ users }));
    }

    print_firebase_logs = () =>{
        axios.post('/users/read_all_data', {access_token: this.state.firebase_token_id })
             .then(res=> {
                 if (res.data.code === 0){
                     console.log(res.data);
                    this.setState({data: JSON.stringify(res.data.data)})
                 }
             })
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
        this.setState({firebase_token_id: response.tokenId});
        axios.post('/users/firebase_login', {access_token:this.state.firebase_token_id })
            .then(res =>{
                console.log(res)

                if (res.data.code === 0){
                    this.setState({message: "firebase log in success", firebase_login: true})
                    }
                else{
                    this.setState({message: "failure"})
                }


            })
            .catch(e => console.log(e));
        // axios.get('/users')
        //     .then((res) => console.log(res));
        console.log(this.state.firebase_token_id)
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


                <GoogleLogin
                    clientId="908046556011-80kbve0btf4nnn1o4vd010a0ag59tfj5.apps.googleusercontent.com"
                    // scope="https://www.googleapis.com/auth/classroom.courses.readonly"
                    scope = "https://www.googleapis.com/auth/classroom.courses
                    https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.profile.emails"
                    onSuccess={this.googleResponse}
                    onFailure={this.googleResponse}
                >  Google classroom Login </GoogleLogin>

                <button type="button" className="btn btn-primary" onClick={this.access_through_service_account}> Service account login</button>

                {  this.state.message !== "" ? <div className="alert alert-primary" role="alert"> {this.state.message } </div>  : <div/> }
                {this.create_course_button(this.state.course_list)}
                <button type="button" className="btn btn-primary" onClick={this.print_firebase_logs}> Read data </button>
                <button type="button" className="btn btn-secondary" onClick={this.erase_data}> Erase data </button>
                <div className="alert alert-primary" role="alert">
                    {this.state.data === null? "No data" : this.state.data}
                </div>

            </div>
        );
    }
}

export default App;
