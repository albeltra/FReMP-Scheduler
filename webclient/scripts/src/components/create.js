import React, { Component } from "react";
// This will require to npm install axios
import axios from 'axios';
 
export default class Create extends Component {
  // This is the constructor that stores the data.
  constructor(props) {
    super(props);
    this.onChangeDate = this.onChangeDate.bind(this); 
this.onChangeLocation = this.onChangeLocation.bind(this); 
this.onChangeName = this.onChangeName.bind(this); 
this.onChangeNumber = this.onChangeNumber.bind(this); 
this.onChangeDNB = this.onChangeDNB.bind(this); 
this.onChangeDropOff = this.onChangeDropOff.bind(this); 
this.onChangePickUp = this.onChangePickUp.bind(this); 
this.onChangeStatus = this.onChangeStatus.bind(this); 
this.onChangeTotalPrice = this.onChangeTotalPrice.bind(this); 
this.onChangeDeposit = this.onChangeDeposit.bind(this); 
this.onChangeDelivery = this.onChangeDelivery.bind(this); 
this.onChangeGenerator = this.onChangeGenerator.bind(this); 
this.onChangeCanopy = this.onChangeCanopy.bind(this); 
this.onChangeCargoTrailer = this.onChangeCargoTrailer.bind(this); 
this.onChangeLargeCooler = this.onChangeLargeCooler.bind(this); 
this.onChangeSmallCooler = this.onChangeSmallCooler.bind(this); 
this.onChangeNotes = this.onChangeNotes.bind(this); 
this.onChangeTent = this.onChangeTent.bind(this); 
this.onChangeGrill = this.onChangeGrill.bind(this); 

    this.state = {"Date": "", 
"Location": "", 
"Name": "", 
"Number": "", 
"DNB": "", 
"Drop Off": "", 
"Pick Up": "", 
"Status": "", 
"Total Price": "", 
"Deposit": "", 
"Delivery": "", 
"Generator": "", 
"Canopy": "", 
"Cargo Trailer": "", 
"Large Cooler": "", 
"Small Cooler": "", 
"Notes": "", 
"Tent": "", 
"Grill": "", 
};
    this.state.token = props.token
    this.onSubmit = this.onSubmit.bind(this); 
  }
 
  // These methods will update the state properties.
  onChangeDate(e) {
                    this.setState({
                      "Date": e.target.value,
                    });
                  }
                onChangeLocation(e) {
                    this.setState({
                      "Location": e.target.value,
                    });
                  }
                onChangeName(e) {
                    this.setState({
                      "Name": e.target.value,
                    });
                  }
                onChangeNumber(e) {
                    this.setState({
                      "Number": e.target.value,
                    });
                  }
                onChangeDNB(e) {
                    this.setState({
                      "DNB": e.target.value,
                    });
                  }
                onChangeDropOff(e) {
                    this.setState({
                      "Drop Off": e.target.value,
                    });
                  }
                onChangePickUp(e) {
                    this.setState({
                      "Pick Up": e.target.value,
                    });
                  }
                onChangeStatus(e) {
                    this.setState({
                      "Status": e.target.value,
                    });
                  }
                onChangeTotalPrice(e) {
                    this.setState({
                      "Total Price": e.target.value,
                    });
                  }
                onChangeDeposit(e) {
                    this.setState({
                      "Deposit": e.target.value,
                    });
                  }
                onChangeDelivery(e) {
                    this.setState({
                      "Delivery": e.target.value,
                    });
                  }
                onChangeGenerator(e) {
                    this.setState({
                      "Generator": e.target.value,
                    });
                  }
                onChangeCanopy(e) {
                    this.setState({
                      "Canopy": e.target.value,
                    });
                  }
                onChangeCargoTrailer(e) {
                    this.setState({
                      "Cargo Trailer": e.target.value,
                    });
                  }
                onChangeLargeCooler(e) {
                    this.setState({
                      "Large Cooler": e.target.value,
                    });
                  }
                onChangeSmallCooler(e) {
                    this.setState({
                      "Small Cooler": e.target.value,
                    });
                  }
                onChangeNotes(e) {
                    this.setState({
                      "Notes": e.target.value,
                    });
                  }
                onChangeTent(e) {
                    this.setState({
                      "Tent": e.target.value,
                    });
                  }
                onChangeGrill(e) {
                    this.setState({
                      "Grill": e.target.value,
                    });
                  }
                
// This function will handle the submission.
  onSubmit(e) {
    e.preventDefault();
 
    // When post request is sent to the create url, axios will add a new record(newperson) to the database.
    const newjob = {
      "Date": this.state["Date"], 
"Location": this.state["Location"], 
"Name": this.state["Name"], 
"Number": this.state["Number"], 
"DNB": this.state["DNB"], 
"Drop Off": this.state["Drop Off"], 
"Pick Up": this.state["Pick Up"], 
"Status": this.state["Status"], 
"Total Price": this.state["Total Price"], 
"Deposit": this.state["Deposit"], 
"Delivery": this.state["Delivery"], 
"Generator": this.state["Generator"], 
"Canopy": this.state["Canopy"], 
"Cargo Trailer": this.state["Cargo Trailer"], 
"Large Cooler": this.state["Large Cooler"], 
"Small Cooler": this.state["Small Cooler"], 
"Notes": this.state["Notes"], 
"Tent": this.state["Tent"], 
"Grill": this.state["Grill"], 

    };
 
    axios
      .post("/flask/add", newjob, {headers: {"X-Access-Token": this.state.token},
        "content-type": "application/json"
    })
      .then((res) => console.log(res.data));
 
    // We will empty the state after posting the data to the database
    this.setState({
      "Date": "", 
"Location": "", 
"Name": "", 
"Number": "", 
"DNB": "", 
"Drop Off": "", 
"Pick Up": "", 
"Status": "", 
"Total Price": "", 
"Deposit": "", 
"Delivery": "", 
"Generator": "", 
"Canopy": "", 
"Cargo Trailer": "", 
"Large Cooler": "", 
"Small Cooler": "", 
"Notes": "", 
"Tent": "", 
"Grill": "", 

    });
  }
 
  // This following section will display the form that takes the input from the user.
  render() {
    return (
    <div>
    <h3>Add Job</h3>
    <form onSubmit={this.onSubmit}>   
       <div className="form-group">
                                    <label>Date: </label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={this.state["Date"]}
                                    onChange={this.onChangeDate} 
                                  />
                                  </div>
                        <div className="form-group">
                                           <label>Location: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Location"]}
                                           onChange={this.onChangeLocation} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Name: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Name"]}
                                           onChange={this.onChangeName} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Number: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Number"]}
                                           onChange={this.onChangeNumber} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>DNB: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["DNB"]}
                                           onChange={this.onChangeDNB} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Drop Off: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Drop Off"]}
                                           onChange={this.onChangeDropOff} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Pick Up: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Pick Up"]}
                                           onChange={this.onChangePickUp} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Status: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Status"]}
                                           onChange={this.onChangeStatus} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Total Price: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Total Price"]}
                                           onChange={this.onChangeTotalPrice} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Deposit: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Deposit"]}
                                           onChange={this.onChangeDeposit} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Delivery: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Delivery"]}
                                           onChange={this.onChangeDelivery} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Generator: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Generator"]}
                                           onChange={this.onChangeGenerator} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Canopy: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Canopy"]}
                                           onChange={this.onChangeCanopy} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Cargo Trailer: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Cargo Trailer"]}
                                           onChange={this.onChangeCargoTrailer} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Large Cooler: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Large Cooler"]}
                                           onChange={this.onChangeLargeCooler} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Small Cooler: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Small Cooler"]}
                                           onChange={this.onChangeSmallCooler} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Notes: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={this.state["Notes"]}
                                           onChange={this.onChangeNotes} 
                                         />
                                         </div>
                               <div className="form-group">
                                           <label>Tent: </label>
                                         <select value={this.state["Tent"]} onChange={this.onChangeTent}>
                                         
                               <option value="Coleman">Coleman</option> 
<option value="North Face">North Face</option> 
<option value="Patagonia">Patagonia</option> 
<option value="Columbia">Columbia</option> 
<option value="Ozark Trail">Ozark Trail</option> 
<option value="EZUP">EZUP</option> 

                                         </select>
                                         </div>
                               <div className="form-group">
                                           <label>Grill: </label>
                                         <select value={this.state["Grill"]} onChange={this.onChangeGrill}>
                                         
                               <option value="Propane">Propane</option> 
<option value="Charcoal">Charcoal</option> 

                                         </select>
                                         </div>
                               
       <input type="submit" value="Submit" className="btn btn-primary"/>
    </form>
    </div>
    );
   };
  }
