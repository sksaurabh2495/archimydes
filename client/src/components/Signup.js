import React, { Component } from 'react';
import Navbar from './Navbar';

const axios = require('axios');

class Signup extends Component {

	constructor () {
    	super();
    	this.state = {
			name: '',
    		email: '',
    		password: '',
    		departmentId: 1,
    		departmentName: 'user',
    		options: [],
    		errorMsg: false
  		};
	}

  	componentDidMount() {
      	
    	axios.get('http://localhost:5000/getDepartment')
        .then(function (response) {
        	// handle success
        	let initialOptions = response.data.aData.map(item => {
        		return {id: item.id, name: item.name}
      		});
      		this.setState({ options: initialOptions });

        }.bind(this))
        .catch(function (error) {
        	// handle error
        	console.log(error);
        })
        .finally(function () {
        	// always executed
        });
  	}

  	dropdownModify = e => {
  		var selectedOption = e.nativeEvent.target[e.nativeEvent.target.selectedIndex].text;
  		this.setState({departmentId: parseInt(e.target.value), departmentName: selectedOption});
  	}

  	handleSubmit = async e => {
    	e.preventDefault();

    	if(this.validate()){
    		this.setState({errorMsg: false});
    		let params = {name: this.state.name, email: this.state.email, password: this.state.password, departmentId: this.state.departmentId, departmentName: this.state.departmentName};
    		axios.post('http://localhost:5000/signup', params)
  			.then(function (response) {
  				if(response.data.code === 555){
            sessionStorage.setItem("__id", response.data.aData.__id);
            sessionStorage.setItem("__email", response.data.aData.__email);
            sessionStorage.setItem("__name", response.data.aData.__name);
            sessionStorage.setItem("____departmentId", response.data.aData.____departmentId);
            sessionStorage.setItem("____departmentName", response.data.aData.____departmentName);
  					window.location.replace("./../" + response.data.aData.__departmentName);
  				}
  			})
  			.catch(function (error) {
    			console.log(error);
  			});
    	}
  	}

  	validate = () => {
  		if(this.state.name === '' || this.state.email === '' || this.state.password === ''){
  			this.setState({errorMsg: true});
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
               			<label>Name</label>
               			<input type="text" name="name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Department</label>
               			<select name="department" onChange={this.dropdownModify} >
							       {this.state.options.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
						        </select>
           			</div>
            		<div className="field">
               			<label>Email</label>
               			<input type="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Password</label>
               			<input type="password" name="password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
           			</div>
   					<button className="submit-button">Submit</button>
   					<div className="error-message" style={this.state.errorMsg ? {} : { display: 'none' }} >
    					Please fill all the fields
   					</div>
				</form>
        	</div>
    	);
  	}
}

export default Signup;