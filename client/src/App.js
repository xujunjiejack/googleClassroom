import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'
import { GoogleLogin } from 'react-google-login';


class App extends Component {
    state = {users: [], email: "", password: ""}

    componentDidMount() {
        // fetch('/users')
        //     .then(res => res.json() )
        //     .then(users => this.setState({ users }));
    }

    googleResponse = (response) =>{
        console.log(response);

        // this.setState({google_access_token: response.accessToken});
        this.setState({google_access_token: response.tokenId});
        axios.post('/users/firebase_login', {access_token:this.state.google_access_token })
            .then(res =>console.log(res))
            .catch(e => console.log(e));
        // axios.get('/users')
        //     .then((res) => console.log(res));
        console.log(this.state.google_access_token)
        // axios.get("https://classroom.googleapis.com/v1/courses", {headers:
        //         {"Application": "Bearer " + this.state.google_access_token}})
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
                {/*<h1>Google Class Login</h1>*/}
                {/*<div className="container">*/}
                    {/*<div className="row justify-content-md-center">*/}
                    {/*<div className="col-sm"/>*/}
                    {/*<div className="col-sm">*/}
                        {/*<form onSubmit={this.handleSubmit}>*/}
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="exampleInputEmail1">Email address</label>*/}
                                {/*<input type="email" className="form-control" id="exampleInputEmail1"*/}
                                       {/*aria-describedby="emailHelp" placeholder="Enter email"*/}
                                       {/*onChange={this.handleEmailChange} value={this.state.email}/>*/}
                                    {/*<small id="emailHelp" className="form-text text-muted">We'll never share your email with*/}
                                        {/*anyone else.*/}
                                    {/*</small>*/}
                            {/*</div>*/}
                            {/*<div className="form-group">*/}
                                {/*<label htmlFor="exampleInputPassword1">Password</label>*/}
                                {/*<input type="password" className="form-control" id="exampleInputPassword1"*/}
                                       {/*placeholder="Password" value={this.state.password}*/}
                                       {/*onChange={this.handlePasswordChange}  />*/}
                            {/*</div>*/}
                            {/*<button type="submit" className="btn btn-primary">Submit</button>*/}
                        {/*</form>*/}
                    {/*</div>*/}
                    {/*<div className="col-sm"/>*/}
                    {/*</div>*/}
                {/*</div>*/}

                <GoogleLogin
                    clientId="908046556011-o4ms5q3maam2et2ft8vhjj769ec2spbm.apps.googleusercontent.com"
                    scope="https://www.googleapis.com/auth/firebase"
                    onSuccess={this.googleResponse}
                    onFailure={this.googleResponse}
                >  </GoogleLogin>
            </div>
        );
    }
}

export default App;
