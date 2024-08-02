import React, { useState, useEffect, ChangeEvent } from 'react';
import { apiRequest } from '@/app/lib/apiHelper';
import { toast } from 'react-toastify';

interface FormData {
  userid: number;
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
  pincode: number;
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
  userData: FormData;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ userData }) => {
  const [formData, setFormData] = useState<FormData>({
    userid: 0,
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
    pincode: 0,
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

  useEffect(() => {
    if (userData) {
      setFormData({
        userid: userData.id || 0,
        fname: userData.user_fname || '',
        lname: userData.user_lname || '',
        email: userData.email || '',
        alt_email_address: userData.alt_email_address || '',
        phone: userData.user_phone || '',
        alt_user_phone: userData.alt_user_phone || '',
        user_pan_no: userData.user_pan_no || '',
        user_aadhaar_no: userData.user_aadhaar_no || '',
        user_address1: userData.user_address1 || '',
        user_address2: userData.user_address2 || '',
        pincode: userData.pincode || 0,
        city: userData.city || '',
        state: userData.state || '',
      });
    }
  }, [userData]);

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
        const data = await apiRequest('GET', '/city-state-pincode', {get: {pincode} });
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

  const validateForm = () => {
    let valid = true;
    let newErrors = {
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
    };

    // Validate first name
    if (!formData.fname) {
      newErrors.fnameError = 'First name is required';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fname)) {
      newErrors.fnameError = 'First Name should contain only alphabets.';
      valid = false;
    }

    // Validate email
    if (!formData.email) {
      newErrors.emailError = 'Email is required';
      valid = false;
    } else if (!/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(formData.email)) {
      newErrors.emailError = 'Invalid email format';
      valid = false;
    }

    // Validate phone
    if (!formData.phone) {
      newErrors.phoneError = 'Phone number is required';
      valid = false;
    } else if (!/^(0|\+[0-9]{1,5})?([6-9][0-9]{9})$/.test(formData.phone)) {
      newErrors.phoneError = 'Invalid phone number';
      valid = false;
    }

    // Validate alternative email
    if (formData.alt_email_address && !/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(formData.alt_email_address)) {
      newErrors.altEmailError = 'Invalid alternative email format';
      valid = false;
    }

    // Validate alternative phone
    if (formData.alt_user_phone && !/^(0|\+[0-9]{1,5})?([6-9][0-9]{9})$/.test(formData.alt_user_phone)) {
      newErrors.altPhoneError = 'Invalid alternative phone number';
      valid = false;
    }

    // Ensure primary and alternative emails are not the same
    if (formData.email && formData.alt_email_address && formData.email === formData.alt_email_address) {
      newErrors.altEmailError = 'Email and alternative email cannot be the same';
      valid = false;
    }

    // Ensure primary and alternative phones are not the same
    if (formData.phone && formData.alt_user_phone && formData.phone === formData.alt_user_phone) {
      newErrors.altPhoneError = 'Phone number and alternative phone number cannot be the same';
      valid = false;
    }

    // Validate PAN number
    if (formData.user_pan_no && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.user_pan_no)) {
      newErrors.panError = 'Invalid PAN number';
      valid = false;
    }

    // Validate Aadhaar number
    if (formData.user_aadhaar_no && !/^[2-9]\d{3}\d{4}\d{4}$/.test(formData.user_aadhaar_no)) {
      newErrors.aadharError = 'Invalid Aadhaar number';
      valid = false;
    }

    // Validate address
    if (!formData.user_address1) {
      newErrors.address1Error = 'Address is required';
      valid = false;
    }

    // Validate pincode
    if (!formData.pincode) {
      newErrors.pincodeError = 'Pincode is required';
      valid = false;
    }

    // Validate city
    if (!formData.city) {
      newErrors.cityError = 'City is required';
      valid = false;
    }

    // Validate state
    if (!formData.state) {
      newErrors.stateError = 'State is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitUserForm = async () => {
    if (validateForm()) {
      try {
        const response = await apiRequest('POST', '/v1/merchant/update/user', {post: formData});
        if (response.StatusCode === '1') {
          toast.success('User profile updated successfully');
          setTimeout(function () {
            window.location.reload();
          }, 2000);
        } else {
          if (response.Result) {
            toast.error(response.Result);
          } else {
            toast.error('Something went wrong. Please try again later.');
          }
        }
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
    } else {
      toast.error('Please fix the errors in the form');
    }
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
            <label>Aadhar Number</label>
            <input
              type="text"
              name="user_aadhaar_no"
              id="user_aadhaar_no"
              placeholder="Aadhar Number"
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
              placeholder="Pincode"
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
              id="city"
              placeholder="City"
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
              id="state"
              placeholder="State"
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
            className="btn btn-success btn-block updateUserProfile"
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