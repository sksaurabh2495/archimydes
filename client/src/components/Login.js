import React, { Component } from 'react';
import Navbar from './Navbar';

const axios = require('axios');

class Login extends Component {
	
	constructor () {
    	super();
    	this.state = {
    		email: '',
    		password: '',
    		errorMsg: false,
    		msgText: 'Invalid Username/Password'
  		};
	}

  	handleSubmit = async e => {
    	e.preventDefault();

    	if(this.validate()){
    		this.setState({errorMsg: false});
    		let params = {email: this.state.email, password: this.state.password};
    		axios.post('http://localhost:5000/login', params)
  			.then(function (response) {
  				if(response.data.code === 222){
  					this.setState({errorMsg: true, msgText: 'Invalid Username/Password'});
  				}
  				else if(response.data.code === 555){
            sessionStorage.setItem("__id", response.data.aData.__id);
            sessionStorage.setItem("__email", response.data.aData.__email);
            sessionStorage.setItem("__name", response.data.aData.__name);
            sessionStorage.setItem("__departmentId", response.data.aData.__departmentId);
            sessionStorage.setItem("__departmentName", response.data.aData.__departmentName);
  					window.location.replace("./" + response.data.aData.__departmentName);
  				}
  			}.bind(this))
  			.catch(function (error) {
    			console.log(error);
  			});
    	}
  	}

  	validate = () => {
  		if(this.state.email === '' || this.state.password === ''){
  			this.setState({errorMsg: true, msgText: 'Please fill all the fields'});
  			return false;
    	}
  		return true;
  	}

  	render() {
    	return (
    		<div>
    			<Navbar />
	            <form className="form" onSubmit={this.handleSubmit}>
                	<p>Enter your credentials</p>
            		<div className="field">
               			<label>Email</label>
               			<input type="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Password</label>
               			<input type="password" name="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
           			</div>
   					<button className="submit-button">Login</button>
   					<a href="/signup">New User? Create Account</a>
   					<div className="error-message" style={this.state.errorMsg ? {} : { display: 'none' }} >
    					{this.state.msgText}
   					</div>
				</form>
        	</div>
    	);
  	}
}

export default Login;