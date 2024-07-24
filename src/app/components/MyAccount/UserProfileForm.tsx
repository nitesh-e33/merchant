import React from 'react';

const UserProfileForm = () => {
  const submitUserForm = () => {
    // Your form submission logic here
  };

  return (
    <form action="/my-account" method="post" id="frmUpdateUserProfile">
      <input type="hidden" name="userid" value="{/* Add user_id value here */}" />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>First Name *</label>
            <input type="text" name="fname" id="fname" placeholder="First Name" className="form-control" />
            <p id="fnameError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="lname" id="lname" placeholder="Last Name" className="form-control" />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Email *</label>
            <input type="email" name="email" placeholder="Email" id="email" className="form-control" />
            <p id="emailError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Alternative Email</label>
            <input type="email" name="alt_email_address" placeholder="Alternative Email" id="alt_email_address" className="form-control" />
            <p id="altEmailError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Mobile *</label>
            <input type="text" name="phone" id="phone" placeholder="Mobile No." className="form-control" />
            <p id="phoneError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Alternative Mobile</label>
            <input type="text" name="alt_user_phone" id="alt_user_phone" placeholder="Alternative Mobile No." className="form-control" />
            <p id="altPhoneError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Pan Number </label>
            <input type="text" name="user_pan_no" id="user_pan_no" placeholder="Pan Number" className="form-control" />
            <p id="panError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Aadhaar No.</label>
            <input type="text" name="user_aadhaar_no" id="user_aadhaar_no" placeholder="Aadhaar No." className="form-control" />
            <p id="aadharError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>User Address 1 *</label>
            <input type="text" name="user_address1" id="user_address1" placeholder="User Address 1" className="form-control" />
            <p id="address1Error" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>User Address 2</label>
            <input type="text" name="user_address2" id="user_address2" placeholder="User Address 2" className="form-control" />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Pincode *</label>
            <input type="text" name="pincode" id="pincode" placeholder="Pin Code" className="form-control" />
            <p id="pincodeError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>City *</label>
            <input type="text" name="city" placeholder="City" id="city" className="form-control" readOnly />
            <p id="cityError" className="text-danger"></p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>State *</label>
            <input type="text" name="state" placeholder="State" id="state" className="form-control" readOnly />
            <p id="stateError" className="text-danger"></p>
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
          <input className="btn btn-success btn-block userFormBtn" type="button" value="Next" onClick={submitUserForm} />
        </div>
      </div>
    </form>
  );
};

export default UserProfileForm;