import { apiRequest } from '@/app/lib/apiHelper';
import React, { useState, ChangeEvent } from 'react';
import { toast } from 'react-toastify';

interface FormData {
  userid: string;
  fname: string;
  lname: string;
  email: string;
  alt_email_address: string;
  phone: string;
  alt_user_phone: string;
  user_pan_no: string;
  user_aadhaar_no: string;
  user_address1: string;
  user_address2: string;
  pincode: string;
  city: string;
  state: string;
}

interface Errors {
  fnameError: string;
  emailError: string;
  phoneError: string;
  altEmailError: string;
  altPhoneError: string;
  panError: string;
  aadharError: string;
  address1Error: string;
  pincodeError: string;
  cityError: string;
  stateError: string;
}
interface UserProfileFormProps {
  userData: any;
}

const UserProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userid: '',
    fname: '',
    lname: '',
    email: '',
    alt_email_address: '',
    phone: '',
    alt_user_phone: '',
    user_pan_no: '',
    user_aadhaar_no: '',
    user_address1: '',
    user_address2: '',
    pincode: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState<Errors>({
    fnameError: '',
    emailError: '',
    phoneError: '',
    altEmailError: '',
    altPhoneError: '',
    panError: '',
    aadharError: '',
    address1Error: '',
    pincodeError: '',
    cityError: '',
    stateError: '',
  });

  const [userData, setUserData] = useState<UserProfileFormProps>({
    userData: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'pincode') {
      handlePincodeInput(value);
    }
  };

  const handlePincodeInput = async (pincode: string) => {
    if (/^\d{6}$/.test(pincode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincodeError: '',
      }));

      try {
        const data = await apiRequest('GET', '/city-state-pincode', { pincode });
        if (data.StatusCode === '1') {
          setFormData((prevData) => ({
            ...prevData,
            city: data.Result.city.city_name,
            state: data.Result.state.state_name,
          }));
        } else {
          if (data.redirect) {
            window.location.href = data.redirect;
          } else if (data.Result) {
            toast.error(data.Result);
          } else {
            console.error('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error fetching city and state:', error);
      }
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincodeError: 'Pincode should be 6 digits.',
      }));
      setFormData((prevData) => ({
        ...prevData,
        city: '',
        state: '',
      }));
    }
  };

  const submitUserForm = () => {
    // Your form submission logic here
  };

  return (
    <form action="/my-account" method="post" id="frmUpdateUserProfile">
      <input type="hidden" name="userid" value={formData.userid} />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>First Name *</label>
            <input
              type="text"
              name="fname"
              id="fname"
              placeholder="First Name"
              className="form-control"
              value={formData.fname}
              onChange={handleChange}
            />
            <p id="fnameError" className="text-danger">{errors.fnameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lname"
              id="lname"
              placeholder="Last Name"
              className="form-control"
              value={formData.lname}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              id="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
            <p id="emailError" className="text-danger">{errors.emailError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Alternative Email</label>
            <input
              type="email"
              name="alt_email_address"
              placeholder="Alternative Email"
              id="alt_email_address"
              className="form-control"
              value={formData.alt_email_address}
              onChange={handleChange}
            />
            <p id="altEmailError" className="text-danger">{errors.altEmailError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Mobile *</label>
            <input
              type="text"
              name="phone"
              id="phone"
              placeholder="Mobile No."
              className="form-control"
              value={formData.phone}
              onChange={handleChange}
            />
            <p id="phoneError" className="text-danger">{errors.phoneError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Alternative Mobile</label>
            <input
              type="text"
              name="alt_user_phone"
              id="alt_user_phone"
              placeholder="Alternative Mobile No."
              className="form-control"
              value={formData.alt_user_phone}
              onChange={handleChange}
            />
            <p id="altPhoneError" className="text-danger">{errors.altPhoneError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Pan Number </label>
            <input
              type="text"
              name="user_pan_no"
              id="user_pan_no"
              placeholder="Pan Number"
              className="form-control"
              value={formData.user_pan_no}
              onChange={handleChange}
            />
            <p id="panError" className="text-danger">{errors.panError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Aadhaar No.</label>
            <input
              type="text"
              name="user_aadhaar_no"
              id="user_aadhaar_no"
              placeholder="Aadhaar No."
              className="form-control"
              value={formData.user_aadhaar_no}
              onChange={handleChange}
            />
            <p id="aadharError" className="text-danger">{errors.aadharError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>User Address 1 *</label>
            <input
              type="text"
              name="user_address1"
              id="user_address1"
              placeholder="User Address 1"
              className="form-control"
              value={formData.user_address1}
              onChange={handleChange}
            />
            <p id="address1Error" className="text-danger">{errors.address1Error}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>User Address 2</label>
            <input
              type="text"
              name="user_address2"
              id="user_address2"
              placeholder="User Address 2"
              className="form-control"
              value={formData.user_address2}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Pincode *</label>
            <input
              type="text"
              name="pincode"
              id="pincode"
              placeholder="Pin Code"
              className="form-control"
              value={formData.pincode}
              onChange={handleChange}
            />
            <p id="pincodeError" className="text-danger">{errors.pincodeError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>City *</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              id="city"
              className="form-control"
              value={formData.city}
              readOnly
            />
            <p id="cityError" className="text-danger">{errors.cityError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>State *</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              id="state"
              className="form-control"
              value={formData.state}
              readOnly
            />
            <p id="stateError" className="text-danger">{errors.stateError}</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-2 col-sm-offset-8">
          <a className="btn btn-info btn-block btnCancel" href="/my-account">
            Cancel
          </a>
        </div>
        <div className="col-sm-2">
          <input
            className="btn btn-success btn-block userFormBtn"
            type="button"
            value="Next"
            onClick={submitUserForm}
          />
        </div>
      </div>
    </form>
  );
};

export default UserProfileForm;