import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import {days, dont_summarize, no_sum} from "./variables"
import MaterialTable from "material-table";

function Summarize(props) {
  let output = "";
  for (var key in props.record) {
    if (!(key in no_sum)){
          if (!(("" + props.record[key]) === "null" )){
            if (!(props.record[key] === 0)) {
              if (!(props.record[key] === "NaN")){
                if (!(props.record[key] === "")){
              output = output + props.record[key] + " " + key + ", " + "\n"}
              }
            }
          }
        }
  }
  return output;
}; 

const Record = (props) => (<tr>
  <td><Link to={"/day/" + props.record["Date"]}>{props.record["Day"]}</Link></td>
  <td>{("Location" in props.record ? <a href={"http://maps.google.com/?q=" + encodeURIComponent(props.record["Location"])}>{props.record["Location"].slice(0, props.record["Location"].length - 10)}</a> : "")}</td>
  <td>{props.record["Name"]}</td>
  <td><a href={"tel:" + props.record["Number"]}>Call</a> <a href={"sms:" + props.record["Number"]}>Text</a></td> 
  <td>{(props.record["DNB"] === "X" ? <a href={"/flask/dnb"} >X</a> : "")}</td>
  <td>{parseInt(props.record["Total Price"]) || ""}</td> 
  <td>{parseInt(props.record["Deposit"]) || ""}</td>
  <td style={{whiteSpace: "pre"}}>{Summarize(props)}</td> 
  <td>{props.record["Notes"]}</td>
  <td>
    <a href={"/flask/invoices/" + encodeURIComponent("Invoice " + props.record["N"] + " " + props.record["Name"] + " " + props.record["Date"] + " .pdf")} >{"View"}</a> | <a href={"/flask/recreate/" + encodeURIComponent("Invoice " + props.record["N"] + " " + props.record["Name"] + " " + props.record["Date"] + " .pdf")}>{" Recreate"}</a>
  </td>
  <td><Link to={"/edit/" + props.record._id}>Edit</Link></td>
  <td><button className="btn btn-link" onClick={() => {props.deleteRecord(props.record._id);}}>Delete</button></td>
</tr>
)

class Day extends Component {
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.state = {records: [], token: props.token};
    this.date = props.match.params.date
  }

  componentDidMount() {
    axios
      .get("/flask/record", {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((response) => {
        this.setState({records: response.data.data})
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  deleteRecord(id) {
    axios.delete("/flask/delete/" + id,
        {headers: {"X-Access-Token": this.state.token}, "content-type": "application/json"})
    this.setState({
      records: this.state.records.filter((el) => el._id !== id),
    });
  }


  recordList() {
    return this.state.records.map((currentrecord) => {
      return (
          <Record
              record={currentrecord}
              deleteRecord={this.deleteRecord}
              key={currentrecord._id}
          />
      );
    }
    );
  }


  render() {
    return (
      <div>
        <h3>Current Jobs</h3>
        <table className="table table-striped" style={{ marginTop: 40 }}>
          <thead>
            <tr>
            <th>Date</th>
            <th>Location</th>
            <th>Name</th>
            <th>Number</th>
            <th>DNB</th>
            <th>Total</th>
            <th>Deposit</th>
            <th>Summary</th>
            <th>Notes</th>
            <th>Invoice</th>
            <th>Edit</th>
            <th>Delete</th>
            </tr>
          </thead>
          <tbody>{this.recordList()}</tbody>
        </table>
      </div>
    );
  }
}
export default withRouter(Day);
