// // ** React Imports
// import { Fragment } from 'react'

// // ** Third Party Components
// import Cleave from 'cleave.js/react'
// import 'cleave.js/dist/addons/cleave-phone.us'

// // ** Reactstrap Components
// import { InputGroup, InputGroupText, Label } from 'reactstrap'

// const PhoneMask = () => {
//   const options = { phone: true, phoneRegionCode: 'US' }
//   return (
//     <Fragment>
//       <Label for='phone-number'>Phone Number</Label>
//       <InputGroup className='input-group-merge'>
//         <InputGroupText>US (+1)</InputGroupText>
//         <Cleave className='form-control' placeholder='1 234 567 8900' options={options} id='phone-number' />
//       </InputGroup>
//     </Fragment>
//   )
// }

// export default PhoneMask

// ** React Imports
import { useState, Fragment } from "react";

// ** Third Party Components
import Cleave from "cleave.js/react";

// ** Reactstrap Components
import { InputGroup, InputGroupText, Label } from "reactstrap";

const PhoneMask = () => {
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1"); // Default to US
  const [phoneValue, setPhoneValue] = useState("");

  const countryCodes = [
    { code: "+1", label: "US (+1)", region: "us" },
    { code: "+91", label: "India (+91)", region: "in" },
    { code: "+44", label: "UK (+44)", region: "gb" },
    { code: "+61", label: "Australia (+61)", region: "au" },
    // Add more countries as needed
  ];

  const handleCountryChange = (e) => {
    setSelectedCountryCode(e.target.value);
  };

  // Function to manually format the phone number
  const formatPhoneNumber = (value) => {
    let formattedValue = value.replace(/\D/g, ""); // Remove non-numeric characters
    switch (selectedCountryCode) {
      case "+1": // US phone number format (xxx) xxx-xxxx
        if (formattedValue.length > 3 && formattedValue.length <= 6) {
          formattedValue = `(${formattedValue.slice(
            0,
            3
          )}) ${formattedValue.slice(3)}`;
        } else if (formattedValue.length > 6) {
          formattedValue = `(${formattedValue.slice(
            0,
            3
          )}) ${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
        }
        break;
      case "+91": // India phone number format xxx-xxx-xxxx
        if (formattedValue.length > 4) {
          formattedValue = `${formattedValue.slice(
            0,
            5
          )}-${formattedValue.slice(5, 10)}`;
        }
        break;
      case "+44": // UK phone number format (xxx) xxx xxxx
        if (formattedValue.length > 3 && formattedValue.length <= 6) {
          formattedValue = `${formattedValue.slice(
            0,
            4
          )} ${formattedValue.slice(4)}`;
        } else if (formattedValue.length > 6) {
          formattedValue = `${formattedValue.slice(
            0,
            4
          )} ${formattedValue.slice(4, 7)} ${formattedValue.slice(7)}`;
        }
        break;
      case "+61": // Australia phone number format (xx) xxxx xxxx
        if (formattedValue.length > 2 && formattedValue.length <= 6) {
          formattedValue = `(${formattedValue.slice(
            0,
            2
          )}) ${formattedValue.slice(2)}`;
        } else if (formattedValue.length > 6) {
          formattedValue = `(${formattedValue.slice(
            0,
            2
          )}) ${formattedValue.slice(2, 6)} ${formattedValue.slice(6)}`;
        }
        break;
      default:
        break;
    }
    return formattedValue;
  };

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setPhoneValue(formattedValue);
  };

  return (
    <Fragment>
      <Label for="phone-number">Phone Number</Label>
      <InputGroup className="input-group-merge">
        {/* Country Code Dropdown */}
        <InputGroupText>
          <select
            value={selectedCountryCode}
            onChange={handleCountryChange}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "inherit",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {countryCodes.map((country) => (
              <option key={country.code} value={country.code}>
                {country.label}
              </option>
            ))}
          </select>
        </InputGroupText>

        {/* Phone Number Input */}
        <Cleave
          className="form-control"
          placeholder="Enter phone number"
          value={phoneValue}
          onChange={handlePhoneChange}
          id="phone-number"
        />
      </InputGroup>
    </Fragment>
  );
};

export default PhoneMask;
