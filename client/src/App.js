import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import User from './components/User';
import Story from './components/Story';
import Admin from './components/Admin';

class App extends Component {
 
  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <div>
            <Route path="/" exact component={Login} />
            <Route path="/signup"  component={Signup} />
            <Route path="/user"  component={User} />
            <Route path="/story"  component={Story} />
            <Route path="/admin"  component={Admin} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
