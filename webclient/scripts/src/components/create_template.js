import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
 
export default class Create extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);
    BIND_METHODS
    this.state = {STATE_DEFAULT};
    this.state.token = props.token
    this.onSubmit = this.onSubmit.bind(this); 
  }
 
  // These methods will update the state properties.
  METHODS
// This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();
 
    // When post request is sent to the create url, axios will add a new record(newperson) to the database.
    const newjob = {
      SET_STATE_EDIT
    };
 
    axios
      .post("/flask/add", newjob, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((res) => console.log(res.data));
 
    // We will empty the state after posting the data to the database
    this.setState({
      STATE_DEFAULT
    });
  }
 
  // This following section will display the form that takes the input from the user.
  render() {
    return (
    <div>
    <h3>Add Job</h3>
    <form onSubmit={this.onSubmit}>   
       COMPONENTS
       <input type="submit" value="Submit" className="btn btn-primary"/>
    </form>
    </div>
    );
   };
  }
