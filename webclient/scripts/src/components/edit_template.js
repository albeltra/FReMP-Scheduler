import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { withRouter } from "react-router";
 

class Edit extends Component {
  constructor(props) { 
    super(props);
    BIND_METHODS
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      "id": "",
      "token": props.token,
      STATE_DEFAULT
    };
  }
  // This will get the record based on the id from the database.
  componentDidMount() {
    axios
      .get("/flask/record/" + this.props.match.params.id, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((response) => {
        this.setState({
          "id": response.data["_id"],
          SET_STATE
      })
      .catch(function (error) {
        console.log(error);
      });
    }
      )};
 
  // These methods will update the state properties.
  onChangeDNB(e) {
    this.setState({
      "DNB": (e.target.value === null || e.target.value === "") ? "" : 'X',
      "DNBReason": e.target.value,  
    });
  }
  METHODS
  // This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();
    const newjob = { 
      SET_STATE_EDIT
    };
  
    // This will send a post request to update the data in the database.
    axios
      .post("/flask/update/" + this.props.match.params.id,
          newjob,
          {headers: {"X-Access-Token": this.state.token}, "content-type": "application/json"}
      )
      .then((res) => console.log(res.data));
 
    this.props.history.push("/");  
  }
 
  // This following section will display the update-form that takes the input from the user to update the data.
  render() {
    return (
        <div>
          <h3>Edit Job</h3>
          <form onSubmit={this.onSubmit}>
            <div className="form-group">
            <label>DNB Reason: </label>
              <input
                  type="text"
                  className="form-control"
                  value={this.state["DNBReason"]}
                  onChange={this.onChangeDNB}
              />
            </div>
            COMPONENTS
            <input type="submit" value="Submit" className="btn btn-primary" />
          </form>
        </div>
    );
   };
  }
  export default withRouter(Edit);
