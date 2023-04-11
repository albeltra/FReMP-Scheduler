import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
import { Link } from "react-router-dom";

const Record = (props) => (
    <tr>
      <td>{props.record["Location"].slice(0, props.record["Location"].length - 15)}</td>
      <td>{props.record["Name"]}</td>
      <td>{props.record["Number"]}</td>
      <td>{props.record["DNBReason"]}</td>
    </tr>
);

class DNB extends Component {
  constructor(props) {
    super(props);
    this.state = { records: [] };
  }

  // This method will get the data from the database.
  componentDidMount() {
    axios
      .get("/flask/dnb")
      .then((response) => {
        this.setState({ records: response.data.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // This method will map out the users on the table
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

  // This following section will display the table with the records of individuals.
  render() {
    return ( 
      <div>
        <h3>DNB List</h3>
        <table className="table table-striped" style={{ marginTop: 40 }}>
          <thead>
            <tr>
            <th>Location</th>
            <th>Name</th>
            <th>Number</th>
            <th>Reason</th> 
            </tr>
          </thead> 
          <tbody>{this.recordList()}</tbody>
        </table>
      </div>
    );
  }
}
export default DNB;
