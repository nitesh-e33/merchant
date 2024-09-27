import { apiRequest } from '@/app/lib/apiHelper';
import { toast } from 'react-toastify';
import React, { useState, useEffect } from 'react';
import { API_ASSET_URL } from '@/app/lib/constant';

const CompanyProfileForm = ({
  userId,
  companyId,
  bankId,
  companyData,
  entityList,
}) => {
  const [formData, setFormData] = useState(companyData);
  const [loading, setLoading] = useState(false);
  const [companyLogo, setCompanyLogo] = useState(null);

  const [errors, setErrors] = useState({
    c_nameError: '',
    hostNameError: '',
    aliasNameError: '',
    c_emailError: '',
    c_phoneError: '',
    c_address1Error: '',
    c_logoError: '',
    entityTypeError: '',
    c_pincodeError: '',
    c_cityError: '',
    c_stateError: '',
  });

  useEffect(() => {
    setFormData(companyData);
  }, [companyData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === 'company_logo') {
      if (files && files.length > 0) {
        const file = files[0];
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const fileSize = file.size;

        // Validate file type and size
        if (!['jpg', 'png', 'jpeg', 'webp'].includes(ext)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            c_logoError: 'File type must be png, jpg, jpeg, or webp',
          }));
        } else if (fileSize > 300 * 1024) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            c_logoError: 'File size must be less than 300KB',
          }));
        } else {
          // File is valid
          setErrors((prevErrors) => ({
            ...prevErrors,
            c_logoError: '',
          }));
          setCompanyLogo(file);
        }
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          c_logoError: '',
        }));
        setFormData((prevData) => ({
          ...prevData,
          company_logo: '',
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (name === 'pincode') {
      handlePincodeInput(value);
    }
  };

  const handlePincodeInput = async (pincode) => {
    if (/^\d{6}$/.test(pincode)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        c_pincodeError: '',
      }));

      try {
        const data = await apiRequest('GET', '/city-state-pincode', { get: { pincode } });
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
        c_pincodeError: 'Pincode should be 6 digits.',
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
      c_nameError: '',
      hostNameError: '',
      aliasNameError: '',
      c_emailError: '',
      c_phoneError: '',
      c_address1Error: '',
      c_logoError: '',
      entityTypeError: '',
      c_pincodeError: '',
      c_cityError: '',
      c_stateError: '',
    };

    // Validate company name
    if (!formData.company_name) {
      newErrors.c_nameError = 'Company name is required';
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(formData.company_name)) {
      newErrors.c_nameError = 'Company name should contain only alphabets';
      valid = false;
    }

    // Validate alias name
    if (!formData.company_alias_name) {
      newErrors.aliasNameError = 'Alias name is required';
      valid = false;
    }

    // Validate host name
    if (!formData.host_name) {
      newErrors.hostNameError = 'Host name is required';
      valid = false;
    }

    // Validate email
    if (!formData.company_email) {
      newErrors.c_emailError = 'Email is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,10}$/.test(formData.company_email)) {
      newErrors.c_emailError = 'Invalid email format';
      valid = false;
    }

    // Validate phone
    if (!formData.company_phone) {
      newErrors.c_phoneError = 'Phone number is required';
      valid = false;
    } else if (!/^(\+?[0-9]{1,5})?([6-9][0-9]{9})$/.test(formData.company_phone)) {
      newErrors.c_phoneError = 'Invalid phone number';
      valid = false;
    }

    // Validate address 1
    if (!formData.company_address1) {
      newErrors.c_address1Error = 'Address is required';
      valid = false;
    }

    // Validate entity type
    if (!formData.entity_type) {
      newErrors.entityTypeError = 'Entity type is required';
      valid = false;
    }

    // Validate pincode
    if (!formData.pincode) {
      newErrors.c_pincodeError = 'Pincode is required';
      valid = false;
    }

    // Validate city
    if (!formData.city) {
      newErrors.c_cityError = 'City is required';
      valid = false;
    }

    // Validate state
    if (!formData.state) {
      newErrors.c_stateError = 'State is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitCompanyForm = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.entries({
        company_name: formData.company_name,
        company_alias_name: formData.company_alias_name,
        host_name: formData.host_name,
        company_email: formData.company_email,
        company_phone: formData.company_phone,
        company_address1: formData.company_address1,
        company_address2: formData.company_address2,
        entity_type: formData.entity_type,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        merchant_user_id: userId,
        company_id: companyId,
        user_account_id: bankId
      }).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });
      if (companyLogo) formDataToSend.append('company_logo', companyLogo);

      const endpoint = companyId ? '/v1/merchant/update-company-profile' : '/v1/merchant/create-company-profile';
      localStorage.removeItem('mprofile');
      localStorage.removeItem('docs');
      const response = await apiRequest('POST', endpoint, {
        post: formDataToSend,
      });

      if (response.StatusCode === '1') {
        toast.success(response.Message);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(response.Result || 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast.error('An error occurred while saving the company profile.');
    }
  };

  return (
    <form action="/" method="post" id="frmCreateCompanyProfile">
      <input type="hidden" name="merchant_user_id" value={userId} />
      <input type="hidden" name="company_id" value={companyId} />
      <input type="hidden" name="user_account_id" value={bankId} />
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Name *</label>
            <input
              type="text"
              name="company_name"
              id="company_name"
              placeholder="Company Name"
              className="form-control"
              value={formData.company_name || ''}
              onChange={handleInputChange}
            />
            <p id="c_nameError" className="text-danger">{errors.c_nameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Alias Name *</label>
            <input
              type="text"
              name="company_alias_name"
              id="company_alias_name"
              placeholder="Company Alias Name"
              className="form-control"
              value={formData.company_alias_name || ''}
              onChange={handleInputChange}
            />
            <p id="aliasNameError" className="text-danger">{errors.aliasNameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Host Name *</label>
            <input
              type="text"
              name="host_name"
              id="host_name"
              placeholder="Host Name"
              className="form-control"
              value={formData.host_name || ''}
              onChange={handleInputChange}
            />
            <p id="hostNameError" className="text-danger">{errors.hostNameError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Email *</label>
            <input
              type="text"
              name="company_email"
              id="company_email"
              placeholder="Company Email"
              className="form-control"
              value={formData.company_email || ''}
              readOnly={companyData.is_email_verified}
              onChange={handleInputChange}
            />
            <p id="c_emailError" className="text-danger">{errors.c_emailError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Phone *</label>
            <input
              type="text"
              name="company_phone"
              id="company_phone"
              placeholder="Company Phone"
              className="form-control"
              value={formData.company_phone || ''}
              readOnly={companyData.is_phone_verified}
              onChange={handleInputChange}
            />
            <p id="c_phoneError" className="text-danger">{errors.c_phoneError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Address 1 *</label>
            <input
              type="text"
              name="company_address1"
              id="company_address1"
              placeholder="Company Address 1"
              className="form-control"
              value={formData.company_address1 || ''}
              readOnly={companyData.is_company__address_verified}
              onChange={handleInputChange}
            />
            <p id="c_address1Error" className="text-danger">{errors.c_address1Error}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Company Address 2</label>
            <input
              type="text"
              name="company_address2"
              id="company_address2"
              placeholder="Company Address 2"
              className="form-control"
              value={formData.company_address2 || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <div className='flex'>
              <label className='mx-2'>Company Logo</label>
              {formData.company_logo && (
                <a
                  href={`${API_ASSET_URL}${formData.company_logo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={`${API_ASSET_URL}${formData.company_logo}`}
                    alt="company_logo"
                    width="40px"
                    height="40px"
                  />
                </a>
              )}
            </div>
            <input
              type="file"
              name="company_logo"
              id="company_logo"
              className="form-control"
              onChange={handleInputChange}
            />
            <p id="c_logoError" className="text-danger">{errors.c_logoError}</p>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="form-group">
            <label>Entity Business Type *</label>
            <select
              name="entity_type"
              id="entity_type"
              className="form-control"
              value={formData.entity_type || ''}
              onChange={handleInputChange}
            >
              <option value="">--Select Entity Type--</option>
              {entityList.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.entity_name}
                </option>
              ))}
            </select>
            <p id="entityTypeError" className="text-danger">{errors.entityTypeError}</p>
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
              value={formData.pincode || ''}
              onChange={handleInputChange}
            />
            <p id="c_pincodeError" className="text-danger">{errors.c_pincodeError}</p>
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
              value={formData.city || ''}
              onChange={handleInputChange}
              disabled
            />
            <p id="c_cityError" className="text-danger">{errors.c_cityError}</p>
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
              value={formData.state || ''}
              onChange={handleInputChange}
              disabled
            />
            <p id="c_stateError" className="text-danger">{errors.c_stateError}</p>
          </div>
        </div>
        <div className="col-sm-2">
          <a className="btn btn-info btn-block btnCancel" href="/my-account">
            Cancel
          </a>
        </div>
        <div className="col-sm-2">
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={submitCompanyForm}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Next'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CompanyProfileForm;