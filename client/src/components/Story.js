import React, { Component } from 'react';
import NavbarUser from './NavbarUser';

const axios = require('axios');

class Story extends Component {

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
    	else if(sessionStorage.getItem("__departmentName") === 'admin') {
    		window.location.replace("./admin");
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
      axios.get('http://localhost:5000/getStories/' + sessionStorage.getItem('__id'))
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

  	render() {
    	return (
    		<div>
    			<NavbarUser logout={this.logout} /> 
	            {this.state.stories.map(
                  (item) => 
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
                  </div>
                )
              }
        	</div>
    	);
  	}
}

export default Story;