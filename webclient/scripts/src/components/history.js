import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { Link } from "react-router-dom";
import {historical} from "./variables"



 

class History extends Component {
    // This is the constructor that shall store our data retrieved from the database
    constructor(props) {
        super(props);
        this.onchangeCheck = this.onchangeCheck.bind(this); 
        this.Summarize = this.Summarize.bind(this);
        this.Record = this.Record.bind(this); 
        this.state = { records: [], key: "", checkedState: new Array(historical.length).fill(false)};
        this.date = props.match.params.date 
    }

    Summarize(props) { 
      let output = ""; 
      output += props.record[this.state.key] + " " + this.state.key + "\n"
      if (this.state.key.includes("Tent") && props.record["Tent Type"]){
          output += props.record["Tent Type"]
      }
      return output;
    };
  

    // This method will get the data from the database.
    onchangeCheck(position) {
        let updatedCheckedState = new Array(historical.length).fill(false)
      updatedCheckedState[position] = true
  
      this.setState({checkedState: updatedCheckedState, key: historical[position]});  
        axios
        .get("/flask/history/" + encodeURIComponent(historical[position]))
        .then((response) => {
            this.setState({ records: JSON.parse(JSON.stringify(response.data)).data  });
        })
        .catch(function (error) {
            console.log(error);
        });
    } 

    Record(props){return (<tr>  
      <td>{props.record["Day"]}</td>
      <td>{props.record["Name"]}</td>
      <td style={{whiteSpace: "pre"}}>{this.Summarize(props)}</td> 
      <td><a href={"/flask/invoices/" + encodeURIComponent("Invoice " + props.record["N"] + " " + props.record["Name"] + " " + props.record["Date"] + " .pdf")} >{"View"}</a></td>
      </tr> )
    } 

    get_checks(){return historical.map((name, index) => {
        return (
          <li key={index}>
            {/* <div className="historical-list-item">
              <div className="left-section"> */}
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  name={name}
                  value={name}
                  checked={this.state.checkedState[index]}
                  onChange={() => this.onchangeCheck(index)}
                />
                <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
              {/* </div>
              <div className="right-section">{getFormattedPrice(price)}</div>
            </div> */}
          </li>
        );
      })} 
    
    // This method will map out the users on the table
    recordList() { 
      let TEMP = this.Record
      if (this.state.records.length > 1) {
        return this.state.records.map((currentrecord) => {
        return (
            <TEMP
            record={currentrecord}
            deleteRecord={this.deleteRecord}
            key={currentrecord._id}
            />
        );
        }
        );
      }
    }
    
    // This following section will display the table with the records of individuals.
    render() {
        let date = "  Date  "
        return ( 
        <div>
            <h3>Current Jobs</h3>
            <ul>{this.get_checks()}</ul>
            <table className="table table-striped" style={{ marginTop: 40 }}>
            <thead>
                <tr>
                <th>{date}</th> 
                <th>Name</th>
                <th>Items</th>
                <th>Invoice</th>
                </tr>
            </thead>
            <tbody>{this.recordList()}</tbody>
            </table>
        </div>
        );
    }
    }
    export default History;