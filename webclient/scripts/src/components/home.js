import { NavLink, Redirect} from "react-router-dom";
import React, { Component } from "react";
const moment = require("moment");

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this); 
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {Date: "", redirect: null}; 
  } 
  onChangeDate(e){
    this.setState({Date: e.target.value});
  }
  onSubmit (e){
  e.preventDefault();
  this.setState({redirect: this.state.Date});
  }
  render() { 
    if (this.state.redirect) { 
      return <Redirect to={"/day/" + this.state.redirect} />
  }
    let day_before = "/day/" + moment().subtract(2, "days").format("YYYY-MM-DD");
    let yesterday = "/day/" + moment().subtract(1, "days").format("YYYY-MM-DD");
    let tomorrow = "/day/" + moment().add(1, "days").format("YYYY-MM-DD");
    let day_after = "/day/" + moment().add(2, "days").format("YYYY-MM-DD");
    let today = "/day/" + moment().format("YYYY-MM-DD");
    let all = "/all/"
    return (
      <div>
        <a>Pick a Date:</a> 
          <form onSubmit={this.onSubmit}>
          <input
            type="date"
            className="form-control"
            value={this.state.Date}
            onChange={this.onChangeDate}
          />
         <input
           type="submit"
           value="Go"
           className="btn btn-primary"
         />
        </form>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr> <th><NavLink className="navbar-brand" to={today}> Today </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={yesterday}> Yesterday </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={day_before}> Day Before Yesterday </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={tomorrow}> Tomorrow </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={day_after}> Day After </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={all}> All </NavLink></th> </tr>
            <tr> <th><NavLink className="navbar-brand" to={"/history"}>History Lookup </NavLink></th> </tr> 
          </thead>
        </table>
      </div> 
    );
  }
}

