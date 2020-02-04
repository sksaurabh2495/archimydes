import React, { Component } from 'react';
import NavbarUser from './NavbarUser';

const axios = require('axios');

class User extends Component {
	
	constructor () {
    	super();
    	this.state = {
    		summary: '',
    		description: '',
    		type: 'Enhancement',
    		complexity: 'Low',
    		time: '',
    		cost: '',
    		errorMsg: false,
    		msgText: 'Please fill all the fields'
  		};
	}

	componentDidMount() {
    	if(!sessionStorage.getItem("__departmentName")){
    		window.location.replace("./../");
    	}
    	else if(sessionStorage.getItem("__departmentName") === 'admin') {
    		window.location.replace("./admin");
    	}
     // axios.get('http://localhost:5000/isLoggedIn')
     //    .then(function (response) {
     //    	if(response.data.code === -111){
     //    		window.location.replace("./../");
     //    	}
     //    	else if(response.data.code === 222){
     //    		window.location.replace("./admin");
     //    	}
     //    })
     //    .catch(function (error) {
     //    	console.log(error);
     //    });
  	}

  	handleSubmit = async e => {
    	e.preventDefault();

    	if(this.validate()){
    		this.setState({errorMsg: false});
    		let params = {summary: this.state.summary, description: this.state.description, type: this.state.type, complexity: this.state.complexity, time: this.state.time, cost: parseInt(this.state.cost), user: sessionStorage};
    		axios.post('http://localhost:5000/createStory', params)
  			.then(function (response) {
  				if(response.data.code === 555){
  					this.setState({summary: '', description: '', time: '', cost: '', errorMsg: true, msgText: 'Story Created Successfully'});
  				}
  			}.bind(this))
  			.catch(function (error) {
    			console.log(error);
  			});
    	}
  	}

  	validate = () => {
  		if(this.state.summary === '' || this.state.description === '' || this.state.time === '' || this.state.cost === ''){
  			this.setState({errorMsg: true, msgText: 'Please fill all the fields'});
  			return false;
    	}
  		return true;
  	}

  	logout = () => {
  		sessionStorage.removeItem('__id');
  		sessionStorage.removeItem('__email');
  		sessionStorage.removeItem('__name');
  		sessionStorage.removeItem('__departmentId');
  		sessionStorage.removeItem('__departmentName');
  		window.location.replace("./../");
  	// axios.get('http://localhost:5000/logout')
    //     .then(function (response) {
    //     	if(response.data.code === 555){
    //     		window.location.replace("./../");
    //     	}
    //     })
    //     .catch(function (error) {
    //     	console.log(error);
    //     });
  	}

  	dropdownModify = e => {
  		this.setState({[e.target.name]: e.target.value});
  	}

  	render() {
    	return (
    		<div>
    			<NavbarUser logout={this.logout} /> 
	            <form className="form" onSubmit={this.handleSubmit}>
                	<p>Create a Story</p>
            		<div className="field">
               			<label>Summary</label>
               			<input type="text" name="summary" value={this.state.summary} onChange={e => this.setState({ summary: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Description</label>
               			<input type="text" name="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Type</label>
               			<select name="type" onChange={this.dropdownModify} >
							<option key="1" value="Enhancement">Enhancement</option>
							<option key="2" value="Bugfix">Bugfix</option>
							<option key="3" value="Development">Development</option>
							<option key="4" value="QA">QA</option>
						</select>
           			</div>
           			<div className="field">
               			<label>Complexity</label>
               			<select name="complexity" onChange={this.dropdownModify} >
							<option key="1" value="Low">Low</option>
							<option key="2" value="Medium">Medium</option>
							<option key="3" value="High">High</option>
						</select>
           			</div>
           			<div className="field">
               			<label>Estimated Time</label>
               			<input type="text" name="time" value={this.state.time} onChange={e => this.setState({ time: e.target.value })} />
           			</div>
           			<div className="field">
               			<label>Cost</label>
               			<input type="text" name="cost" value={this.state.cost} onChange={e => this.setState({ cost: (e.target.value).replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1') })} />
           			</div>
   					<button className="submit-button">Create</button>
   					<div className="error-message" style={this.state.errorMsg ? {} : { display: 'none' }} >
    					{this.state.msgText}
   					</div>
				</form>
        	</div>
    	);
  	}
}

export default User;