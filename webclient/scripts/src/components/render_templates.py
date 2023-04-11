from variables import variables, modifiers, primaries

no_sum = [
    "Location",
    "Day",
    "Date",
    "Name",
    "N",
    "Geocode",
    "City",
    "DNB",
    "selected",
    "Drop Off",
    "Pick Up",
    "Total Price",
    "Deposit",
    "Same Day Pickup",
    "Refundable Deposit",
    "Notes",
    "Status",
    "_id",
    "Number",
    "ISODate",
    "Delivery",
    "DNBReason"
]

no_summarize = no_sum + [y for x in modifiers for y in x]

STATE_DEFAULT = ""
for key in variables:
    STATE_DEFAULT += f""""{key}": "", \n"""

SET_STATE = ""
for key in variables:
    SET_STATE += f""""{key}": response.data["{key}"], \n"""

SET_STATE_EDIT = ""
for key in variables:
    SET_STATE_EDIT += f""""{key}": this.state["{key}"], \n"""
METHODS = ""
for key in variables:
    temp = f"""onChange{key.replace(" ", "")}(e) {{
                    this.setState({{
                      "{key}": e.target.value,
                    }});
                  }}
                """
    METHODS += temp

BIND_METHODS = ""
for key in variables:
    BIND_METHODS += f"""this.onChange{key.replace(" ", "")} = this.onChange{key.replace(" ", "")}.bind(this); \n"""

COMPONENTS = ""
for key in variables:
    if key == "Date":
        COMPONENTS += f"""<div className="form-group">
                                    <label>{key}: </label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    value={{this.state["{key}"]}}
                                    onChange={{this.onChange{key.replace(" ", "")}}} 
                                  />
                                  </div>
                        """
    elif key in primaries:
        temp = ""
        for key2 in modifiers[primaries.index(key)]:
            temp += '<option value="' + key2 + '">' + key2 + '</option> \n'
        COMPONENTS += """<div className="form-group">
                                           <label>{2}: </label>
                                         <select value={{this.state["{0}"]}} onChange={{this.onChange{1}}}>
                                         
                               """.format(key.title(), key.title().replace(" ", ""), key.title()) + temp + \
                      """
                                         </select>
                                         </div>
                               """
    else:
        COMPONENTS += f"""<div className="form-group">
                                           <label>{key}: </label>
                                         <input
                                           type="text"
                                           className="form-control"
                                           value={{this.state["{key}"]}}
                                           onChange={{this.onChange{key.replace(" ", "")}}} 
                                         />
                                         </div>
                               """

SUM_KEYS = ""
HISTORICAL_KEYS = ""
for key in variables:
    if key not in no_sum:
        SUM_KEYS += f""""{key}": "", \n"""
        HISTORICAL_KEYS += f""""{key}", \n"""
NO_SUM = ""
for key in no_sum:
    NO_SUM += f""""{key}": "", \n"""

DONT_SUMMARIZE = ""
for key in no_summarize:
    DONT_SUMMARIZE += f""""{key}": "", \n"""

TENT_TYPES = ""
for key in modifiers:
    TENT_TYPES += f""""{key}": "", \n"""

files = ["create_template.js", "edit_template.js", "variables_template.js"]
for file in files:
    with open(file, 'r') as f:
        filedata = f.read()
    filedata = filedata.replace("TENT_TYPES", TENT_TYPES)
    filedata = filedata.replace("DONT_SUMMARIZE", DONT_SUMMARIZE)
    filedata = filedata.replace("NO_SUM", NO_SUM)
    filedata = filedata.replace("SUM_KEYS", SUM_KEYS)
    filedata = filedata.replace("HISTORICAL_KEYS", HISTORICAL_KEYS)
    filedata = filedata.replace("BIND_METHODS", BIND_METHODS)
    filedata = filedata.replace("COMPONENTS", COMPONENTS)
    filedata = filedata.replace("METHODS", METHODS)
    filedata = filedata.replace("SET_STATE_EDIT", SET_STATE_EDIT)
    filedata = filedata.replace("SET_STATE", SET_STATE)
    filedata = filedata.replace("STATE_DEFAULT", STATE_DEFAULT)

    with open(file.replace('_template', ''), 'w') as f:
        f.write(filedata)
