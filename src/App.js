import React, { Component } from 'react'
import './App.css';
import Home from './Home';
import Login from './Login';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';


function App() {

  

  return (
    <Router>
      <Switch>
       <div className="App">
           
           <Route path="/" exact component={Login} />
           <Route path="/Login" component={Login} />
           <Route path="/Home" component={Home} />
           
      </div>
            
      
      </Switch>
    </Router>
  );
}

export default App;

