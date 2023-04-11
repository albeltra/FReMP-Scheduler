import React, { Component } from "react";
import axios from 'axios';
import { Link, withRouter } from "react-router-dom";
import {tent_types, dont_summarize, no_sum, sum_keys} from "./variables"

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



class Day extends Component {
  // This is the constructor that shall store our data retrieved from the database
  constructor(props) {
    super(props);
    this.deleteRecord = this.deleteRecord.bind(this);
    this.Record = this.Record.bind(this);
    this.onItemCheck = this.onItemCheck.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDepositChange = this.handleDepositChange.bind(this);
    this.onMasterCheck = this.onMasterCheck.bind(this);
    this.SummarizeChecked = this.SummarizeChecked.bind(this);
    this.Sum = this.Sum.bind(this)
    this.Totals = this.Totals.bind(this)
    this.state = {
      records: [],
      MasterChecked: false,
      SelectedList: [],
      token: props.token
    };
    this.date = props.match.params.date
  }

  Sum = (key) => {
    let output = 0;
    for (var i=0; i < this.state.records.length; i ++){
      let temp = parseInt(this.state.records[i][key]);
      if (!(isNaN(temp))){
      output += temp;
      }
    }
    return output;}

  SummarizeAll = () => {
    let output = {};
    let output_str = ""; // "All Jobs: " + "\n";
    for (var i=0; i < this.state.records.length; i ++){
      for (var key in this.state.records[i]) {
        if (!(key in dont_summarize)){
            if (!(key in output)){
              let temp =  this.state.records[i][key];
              let float = parseFloat(temp);
              if (isNaN(float)){
                output[key] = this.state.records[i][key];
              }
              else {
                output[key] = float;
              }
            }
            else {
              let temp =  this.state.records[i][key];
              let float = parseFloat(temp);
              if (isNaN(float)){
                output[key] += " | " + this.state.records[i][key];
              }
              else {
                output[key] += float;
              }
            }
      }
      }
    }
    for (var key in sum_keys) {
      if (key in output){
      output_str += output[key] + " " + key + ", " + "\n"
      }
    }
    return output_str;}

  SummarizeChecked = () => {
    let output = {};
    let output_str = "";
    for (var i=0; i < this.state.records.length; i ++){
      if (this.state.records[i].selected){
      for (var key in this.state.records[i]) {
        if (!(key in dont_summarize)){
            if (!(key in output)){
              let temp =  this.state.records[i][key];
              let float = parseFloat(temp);
              if (isNaN(float)){
                output[key] = this.state.records[i][key];
              }
              else {
                output[key] = float;
              }
            }
            else {
              let temp =  this.state.records[i][key];
              let float = parseFloat(temp);
              if (isNaN(float)){
                output[key] += " | " + this.state.records[i][key];
              }
              else {
                output[key] += float;
              }
            }
      }
      }
    }
    }
    for (var key in sum_keys) {
      if (key in output){
      output_str += output[key] + " " + key + ", " + "\n"
      }
    }
    return output_str;}

  Totals = () => (
    <tr>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>{this.Sum("Total Price")}</td>
    <td>{this.Sum("Delivery") || ""}</td>
    <td>{this.Sum("Deposit") || ""}</td>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    );
    Record = (props) => {

      return (
      <tr>
      <td>{("Location" in props.record ? <a href={"http://maps.google.com/?q=" + encodeURIComponent(props.record["Location"])}>{props.record["Location"].slice(0, props.record["Location"].length - 10)}</a> : "")}</td>
      <td>{props.record["Name"]}</td>
      <td><a href={"tel:" + props.record["Number"]} >Call</a> <a href={"sms:" + props.record["Number"]} >Text</a></td>
      <td>{(props.record["DNB"] === "X" ? <a href={"/flask/dnb"} >X</a> : "")}</td>
      <td><input
                              type="checkbox"
                              checked={props.record.selected}
                              className="form-check-input"
                              id="rowcheck{props.record._id}"
                              onChange={(e) => this.onItemCheck(e, props.record)}
                            /></td>
      <td>{props.record["Drop Off"]}</td>
      <td>{props.record["Pick Up"]}</td>
      <td><select
          name="Status"
          value={props.record["Status"]}
          onChange={(e) => this.handleChange(e, props.record)}
        >
          <option value={undefined}></option>
          <option value="Delivered">{"\u274C"}</option>
          <option value="Collected">{"\u2705"}</option>
        </select></td>
      <td>{parseInt(props.record["Total Price"]) || ""}</td>
      <td>{parseInt(props.record["Delivery"]) || ""}</td>
      <td>{parseInt(props.record["Deposit"]) || ""}</td>
      <td><select
          name="Refundable Deposit"
          value={props.record["Refundable Deposit"]}
          onChange={(e) => this.handleDepositChange(e, props.record)}
        >
          <option value={undefined}></option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
          <option value="125">125</option>
          <option value="150">150</option>
          <option value="Other">Other</option>
        </select></td>
      <td style={{whiteSpace: "pre"}}>{Summarize(props)}</td>
      <td>{props.record["Notes"]}</td>
      <td><a href={"/flask/invoices/" + encodeURIComponent("Invoice " + props.record["N"] + " " + props.record["Name"] + " " + props.record["Date"] + " .pdf")} >{"View"}</a> | <a href={"/flask/recreate/" + encodeURIComponent("Invoice " + props.record["N"] + " " + props.record["Name"] + " " + props.record["Date"] + " .pdf")}>{" Recreate"}</a></td>
      <td><Link to={"/edit/" + props.record._id}>Edit</Link> </td>
      <td></td>
      </tr>
      )};

      handleDepositChange(e, props){
        let tempList = this.state.records;
        tempList.map((x) => {
          if (x._id === props._id) {
            x["Refundable Deposit"] = e.target.value;
          }
          return x;
        });
        this.setState({
          records: tempList,
        });
        axios
      .post("/flask/update/" + props._id, {"Refundable Deposit": props["Refundable Deposit"]}, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((res) => console.log(res.data));
      }

      handleChange(e, props){
        let tempList = this.state.records;
        tempList.map((x) => {
          if (x._id === props._id) {
            x.Status = e.target.value;
          }
          return x;
        });
        this.setState({
          records: tempList,
        });
        axios
      .post("/flask/update/" + props._id, {"Status": props["Status"]}, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((res) => console.log(res.data));
      }

      onItemCheck(e, props) {
        let tempList = this.state.records;
        tempList.map((x) => {
          if (x._id === props._id) {
            x.selected = e.target.checked;
          }
          return x;
        });


        //To Control Master Checkbox State
        const totalItems = this.state.records.length;
        const totalCheckedItems = tempList.filter((e) => e.selected).length;

        // Update State
        this.setState({
          MasterChecked: totalItems === totalCheckedItems,
          records: tempList,
          SelectedList: this.state.records.filter((e) => e.selected),
        });
      };




  // This method will get the data from the database.
  onMasterCheck(e) {
    let tempList = this.state.records;
    tempList.map((props) => (props.selected = e.target.checked));
    //Update State
    console.log(tempList)
    this.setState({
      MasterChecked: e.target.checked,
      records: tempList,
      SelectedList: this.state.records.filter((e) => e.selected),
    });
  }

  getSelectedRows() {
    this.setState({
      SelectedList: this.state.records.filter((e) => e.selected),
    });
  }


  componentDidMount() {
    axios
      .get("/flask/day/" + this.date, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((response) => {
        this.setState({ records: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // This method will delete a record based on the method
  deleteRecord(id) {
    axios.delete("/flask/" + id, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    }).then((response) => {
      console.log(response.data);
    });

    this.setState({
      records: this.state.records.filter((el) => el._id !== id),
    });
  }

  // This method will map out the users on the table
  recordList() {
    return this.state.records.map((currentrecord) => {
      return (
        <this.Record
          record={currentrecord}
          deleteRecord={this.deleteRecord}
          key={currentrecord._id}
        />

      );
    }
    );
  }

  // This following section will display the table with the records of individuals.
  render() {
    return (
      <div>
        {/*<h3>{days[new Date(this.date + "T00:00:00").getDay()] + " " + this.date.slice(5, this.date.length)}   </h3> */}
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
            <th>Maps</th>
            <th>Name</th>
            <th>Number</th>
            <th>DNB</th>
            <th><input
                      type="checkbox"
                      className="form-check-input"
                      checked={this.state.MasterChecked}
                      id="mastercheck"
                      onChange={(e) => this.onMasterCheck(e)}
                    /></th>
            <th>Drop Off</th>
            <th>Pick Up</th>
            <th>Status</th>
            <th>Total</th>
            <th>Delivery</th>
            <th>Deposit</th>
            <th>Refundable</th>
            <th>Summary</th>
            <th>Notes</th>
            <th>Invoice</th>
            <th>Edit</th>
            </tr>
          </thead>
          <tbody>{this.recordList()}</tbody>
      <tr>
    <td>TOTALS:</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td>{this.Sum("Total Price")}</td>
    <td>{this.Sum("Delivery") || ""}</td>
    <td>{this.Sum("Deposit") || ""}</td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    </tr>
    </table>
      <tr style={{fontWeight: "bold"}}>
        <td>All Jobs</td>
        <td>{"Checked        "}</td>
      </tr>
      <tr>
        <td style={{whiteSpace: "pre"}}>{this.SummarizeAll()}</td>
        {/*<td style={{whiteSpace: "pre"}}>{this.SummarizeJumpers()}</td>*/}
        <td style={{whiteSpace: "pre"}}>{this.SummarizeChecked()}</td>
      </tr>


      </div>
    );
  }
}
export default withRouter(Day);
