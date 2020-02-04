import React, { Component } from 'react';
import NavbarAdmin from './NavbarAdmin';

const axios = require('axios');

class Admin extends Component {

  constructor () {
      super();
      this.state = {
        stories: []
      };
  }

	componentDidMount() {
    	if(!sessionStorage.getItem("__departmentName")){
    		window.location.replace("./../");
    	}
    	else if(sessionStorage.getItem("__departmentName") === 'user') {
    		window.location.replace("./user");
    	}
      this.feed();
  	}

  	logout = () => {
  		sessionStorage.removeItem('__id');
  		sessionStorage.removeItem('__email');
  		sessionStorage.removeItem('__name');
  		sessionStorage.removeItem('__departmentId');
  		sessionStorage.removeItem('__departmentName');
  		window.location.replace("./../");
  	}

    feed = () => {
      axios.get('http://localhost:5000/getStories/admin')
        .then(function (response) {
          let initialStories = response.data.aData.map(item => {
            return item
          });
          this.setState({ stories: initialStories });

        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
    }

    accept_request = (id, index) => {
    	let params = {id: id};
    	axios.get('http://localhost:5000/accept', {params})
        .then(function (response) {
        	if(response.data.code === 555){
        		const { stories } = this.state;
        		stories[index].status = 1;
        		this.setState({ stories });
        	}
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
    }

    reject_request = (id, index) => {
    	let params = {id: id};
    	axios.get('http://localhost:5000/reject', {params})
        .then(function (response) {
        	if(response.data.code === 555){
        		const { stories } = this.state;
        		stories[index].status = -1;
        		this.setState({ stories });
        	}
        }.bind(this))
        .catch(function (error) {
          console.log(error);
        });
    }

  	render() {
    	return (
    		<div>
    			<NavbarAdmin logout={this.logout} /> 
	            {this.state.stories.map(
                  (item, index) => 
                  <div key={item.id} className="story-card">
                    <div><span>Author: </span>{item.uname} ({item.uemail})</div>
                    <div><span>Summary: </span>{item.summary}</div>
                    <div><span>Description: </span>{item.description}</div>
                    <div><span>Type: </span>{item.type}</div>
                    <div><span>Complexity: </span>{item.complexity}</div>
                    <div><span>Time: </span>{item.time}</div>
                    <div><span>Cost: </span>${item.cost}</div>
                    <div><span>Status: </span>
                      {(() => {
                      switch (item.status) {
                        case 0:   return "Pending";
                        case 1: return "Accepted";
                        case -1:  return "Rejected";
                        default:      return "Pending";
                      }
                      })()}
                    </div>
                    {(() => {
        			if (item.status === 0) {
          			return (
                    <div>
                    	<button className="positive action-btn" onClick={() => this.accept_request(item.id,index)}>Accept</button>
                        <button className="negative action-btn" onClick={() => this.reject_request(item.id,index)}>Reject</button>
                    </div>
                    )}
      				})()}
                  </div>
                )
              }
        	</div>
    	);
  	}
}

export default Admin;